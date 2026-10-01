-- =============================================================================
-- One More Step · Esquema inicial (fase 1)
--
-- Tablas: users, profiles, onboarding_responses, communities,
--         community_members, goals
-- Vista:  public_profiles (perfil público filtrado por privacidad)
--
-- Principios:
--   * RLS activado en TODAS las tablas. Por defecto nadie ve nada.
--   * Los datos sensibles (email, edad, rol) nunca se exponen a otros usuarios.
--   * Valores tipo "enum" con CHECK sobre text: se amplían sin migraciones
--     dolorosas (ALTER TYPE no permite borrar valores).
--   * Contadores desnormalizados (member_count) mantenidos por triggers.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Utilidades
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- users: datos privados de la cuenta (solo visibles para su dueño)
-- -----------------------------------------------------------------------------

create table public.users (
  id                      uuid primary key references auth.users (id) on delete cascade,
  email                   text,
  role                    text not null default 'user' check (role in ('user', 'admin')),
  onboarding_completed_at timestamptz,
  last_seen_at            timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- Helpers de autorización (security definer para poder usarlos dentro de RLS
-- sin recursión). search_path fijado para evitar secuestro de funciones.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- profiles: identidad y preferencias del perfil.
-- La tabla base solo la lee su dueño; los demás usuarios usan la vista
-- public_profiles, que oculta campos según el nivel de privacidad.
-- -----------------------------------------------------------------------------

create table public.profiles (
  id                uuid primary key references public.users (id) on delete cascade,
  username          text not null unique
                      check (username ~ '^[a-z0-9_]{3,30}$'),
  display_name      text not null default ''
                      check (char_length(display_name) <= 50),
  avatar_url        text,
  bio               text check (char_length(bio) <= 280),
  age               smallint check (age between 13 and 120),
  occupation        text check (occupation in (
                      'student', 'employed', 'entrepreneur', 'work_and_study',
                      'job_seeking', 'building_project', 'other')),
  occupation_other  text check (char_length(occupation_other) <= 60),
  focus_areas       text[] not null default '{}',
  visibility        text not null default 'limited'
                      check (visibility in ('public', 'limited', 'private')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- onboarding_responses: respuestas brutas del onboarding.
-- `version` permite cambiar el cuestionario sin perder respuestas antiguas.
-- -----------------------------------------------------------------------------

create table public.onboarding_responses (
  user_id             uuid primary key references public.users (id) on delete cascade,
  version             smallint not null default 1,
  name                text not null check (char_length(name) between 1 and 50),
  age                 smallint not null check (age between 13 and 120),
  occupation          text not null,
  occupation_other    text,
  life_goals          text[] not null default '{}',
  life_goals_other    text,
  main_goal           text not null check (char_length(main_goal) between 1 and 200),
  stage               text not null check (stage in (
                        'not_started', 'starting', 'weeks', 'months', 'years')),
  motivation          text check (char_length(motivation) <= 500),
  daily_time          text not null check (daily_time in (
                        'lt_30m', '30_60m', '1_2h', '2_4h', 'gt_4h', 'varies')),
  social_preferences  text[] not null default '{}',
  privacy_level       text not null check (privacy_level in ('public', 'limited', 'private')),
  first_step          text not null check (char_length(first_step) between 1 and 200),
  completed_at        timestamptz not null default now(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger onboarding_set_updated_at
  before update on public.onboarding_responses
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- communities
-- `archived_at` = borrado lógico (no se pierden miembros ni contenido futuro).
-- -----------------------------------------------------------------------------

create table public.communities (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  name          text not null check (char_length(name) between 2 and 60),
  description   text not null default '' check (char_length(description) <= 500),
  icon          text not null default '✨',
  color         text not null default '#10b981' check (color ~ '^#[0-9a-fA-F]{6}$'),
  cover_url     text,
  is_official   boolean not null default true,
  member_count  integer not null default 0 check (member_count >= 0),
  sort_order    integer not null default 0,
  created_by    uuid references public.users (id) on delete set null,
  archived_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index communities_active_idx
  on public.communities (sort_order, name) where archived_at is null;

create trigger communities_set_updated_at
  before update on public.communities
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- community_members
-- `role` preparado para moderadores/propietarios en el futuro.
-- -----------------------------------------------------------------------------

create table public.community_members (
  community_id  uuid not null references public.communities (id) on delete cascade,
  user_id       uuid not null references public.users (id) on delete cascade,
  role          text not null default 'member'
                  check (role in ('member', 'moderator', 'owner')),
  joined_at     timestamptz not null default now(),
  primary key (community_id, user_id)
);

create index community_members_user_idx on public.community_members (user_id);

create or replace function public.sync_community_member_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.communities set member_count = member_count + 1
    where id = new.community_id;
  elsif tg_op = 'DELETE' then
    update public.communities set member_count = greatest(member_count - 1, 0)
    where id = old.community_id;
  end if;
  return null;
end;
$$;

create trigger community_members_count
  after insert or delete on public.community_members
  for each row execute function public.sync_community_member_count();

-- -----------------------------------------------------------------------------
-- goals
--   kind = 'main'      → objetivo principal (uno activo por usuario)
--   kind = 'secondary' → objetivos secundarios
--   kind = 'step'      → pasos concretos ("One More Step"), cuelgan de parent_id
-- -----------------------------------------------------------------------------

create table public.goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users (id) on delete cascade,
  parent_id     uuid references public.goals (id) on delete cascade,
  community_id  uuid references public.communities (id) on delete set null,
  kind          text not null check (kind in ('main', 'secondary', 'step')),
  title         text not null check (char_length(title) between 1 and 200),
  description   text check (char_length(description) <= 1000),
  status        text not null default 'active'
                  check (status in ('active', 'completed', 'paused', 'abandoned')),
  visibility    text not null default 'inherit'
                  check (visibility in ('inherit', 'public', 'private')),
  progress      smallint not null default 0 check (progress between 0 and 100),
  target_date   date,
  completed_at  timestamptz,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (kind <> 'step' or parent_id is not null)
);

create index goals_user_idx on public.goals (user_id, kind, status);
create index goals_parent_idx on public.goals (parent_id);
create unique index goals_one_active_main
  on public.goals (user_id) where kind = 'main' and status = 'active';

create trigger goals_set_updated_at
  before update on public.goals
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Alta automática: al registrarse con Google se crean users + profiles.
-- -----------------------------------------------------------------------------

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := lower(regexp_replace(split_part(coalesce(new.email, 'user'), '@', 1), '[^a-zA-Z0-9_]', '', 'g'));
  if char_length(base_username) < 3 then
    base_username := 'user' || base_username;
  end if;
  base_username := left(base_username, 20);
  final_username := base_username;

  while exists (select 1 from public.profiles where username = final_username) loop
    final_username := base_username || '_' || substr(md5(random()::text), 1, 5);
  end loop;

  insert into public.users (id, email) values (new.id, new.email);

  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    final_username,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 50),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- -----------------------------------------------------------------------------
-- complete_onboarding: guarda todo el onboarding en UNA transacción.
-- security definer porque toca columnas que el cliente no puede editar
-- (users.onboarding_completed_at). Siempre actúa sobre auth.uid().
-- -----------------------------------------------------------------------------

create or replace function public.complete_onboarding(payload jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  main_goal_id uuid;
  community_ids uuid[];
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  insert into public.onboarding_responses as o (
    user_id, version, name, age, occupation, occupation_other,
    life_goals, life_goals_other, main_goal, stage, motivation,
    daily_time, social_preferences, privacy_level, first_step
  ) values (
    uid,
    coalesce((payload ->> 'version')::smallint, 1),
    trim(payload ->> 'name'),
    (payload ->> 'age')::smallint,
    payload ->> 'occupation',
    nullif(trim(payload ->> 'occupation_other'), ''),
    coalesce(array(select jsonb_array_elements_text(payload -> 'life_goals')), '{}'),
    nullif(trim(payload ->> 'life_goals_other'), ''),
    trim(payload ->> 'main_goal'),
    payload ->> 'stage',
    nullif(trim(payload ->> 'motivation'), ''),
    payload ->> 'daily_time',
    coalesce(array(select jsonb_array_elements_text(payload -> 'social_preferences')), '{}'),
    payload ->> 'privacy_level',
    trim(payload ->> 'first_step')
  )
  on conflict (user_id) do update set
    version = excluded.version,
    name = excluded.name,
    age = excluded.age,
    occupation = excluded.occupation,
    occupation_other = excluded.occupation_other,
    life_goals = excluded.life_goals,
    life_goals_other = excluded.life_goals_other,
    main_goal = excluded.main_goal,
    stage = excluded.stage,
    motivation = excluded.motivation,
    daily_time = excluded.daily_time,
    social_preferences = excluded.social_preferences,
    privacy_level = excluded.privacy_level,
    first_step = excluded.first_step,
    completed_at = now();

  update public.profiles set
    display_name = trim(payload ->> 'name'),
    age = (payload ->> 'age')::smallint,
    occupation = payload ->> 'occupation',
    occupation_other = nullif(trim(payload ->> 'occupation_other'), ''),
    focus_areas = coalesce(array(select jsonb_array_elements_text(payload -> 'life_goals')), '{}'),
    visibility = payload ->> 'privacy_level'
  where id = uid;

  -- Objetivo principal + primer paso (si se repite el onboarding se archiva el anterior)
  update public.goals set status = 'paused'
  where user_id = uid and kind = 'main' and status = 'active';

  insert into public.goals (user_id, kind, title)
  values (uid, 'main', trim(payload ->> 'main_goal'))
  returning id into main_goal_id;

  insert into public.goals (user_id, parent_id, kind, title)
  values (uid, main_goal_id, 'step', trim(payload ->> 'first_step'));

  -- Comunidades elegidas (solo activas)
  select coalesce(array_agg(c.id), '{}') into community_ids
  from public.communities c
  where c.archived_at is null
    and c.id in (
      select (jsonb_array_elements_text(payload -> 'community_ids'))::uuid
    );

  insert into public.community_members (community_id, user_id)
  select unnest(community_ids), uid
  on conflict do nothing;

  update public.users set onboarding_completed_at = coalesce(onboarding_completed_at, now())
  where id = uid;
end;
$$;

revoke all on function public.complete_onboarding(jsonb) from public, anon;
grant execute on function public.complete_onboarding(jsonb) to authenticated;

-- -----------------------------------------------------------------------------
-- public_profiles: lo que otros usuarios pueden ver de un perfil.
--   public  → todo excepto datos de cuenta (email, rol)
--   limited → sin edad ni ocupación
--   private → solo nombre, avatar y usuario
-- Es una vista con privilegios del propietario a propósito: el enmascarado
-- está aquí, y la tabla base profiles sigue siendo solo-dueño.
-- -----------------------------------------------------------------------------

create or replace view public.public_profiles
with (security_barrier = true)
as
select
  p.id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.visibility,
  p.created_at as joined_at,
  case when p.visibility <> 'private' then p.bio end as bio,
  case when p.visibility = 'public' then p.age end as age,
  case when p.visibility = 'public' then p.occupation end as occupation,
  case when p.visibility = 'public' then p.occupation_other end as occupation_other,
  case when p.visibility <> 'private' then p.focus_areas else '{}'::text[] end as focus_areas,
  case when p.visibility <> 'private' then (
    select g.title from public.goals g
    where g.user_id = p.id and g.kind = 'main' and g.status = 'active'
      and g.visibility <> 'private'
    limit 1
  ) end as main_goal,
  case when p.visibility <> 'private' then (
    select count(*)::int from public.goals g
    where g.user_id = p.id and g.kind = 'step' and g.status = 'completed'
  ) else 0 end as steps_completed,
  case when p.visibility <> 'private' then coalesce((
    select jsonb_agg(jsonb_build_object(
      'slug', c.slug, 'name', c.name, 'icon', c.icon, 'color', c.color
    ) order by c.sort_order)
    from public.community_members m
    join public.communities c on c.id = m.community_id and c.archived_at is null
    where m.user_id = p.id
  ), '[]'::jsonb) else '[]'::jsonb end as communities
from public.profiles p
join public.users u on u.id = p.id
where u.onboarding_completed_at is not null;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.users                enable row level security;
alter table public.profiles             enable row level security;
alter table public.onboarding_responses enable row level security;
alter table public.communities          enable row level security;
alter table public.community_members    enable row level security;
alter table public.goals                enable row level security;

-- users: solo lectura de la propia fila; ningún cambio directo desde el cliente
create policy "users: read own" on public.users
  for select to authenticated using (id = (select auth.uid()));

-- profiles: el dueño lee y edita su fila (columnas limitadas por GRANT)
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- onboarding: solo el dueño lo lee; se escribe vía complete_onboarding()
create policy "onboarding: read own" on public.onboarding_responses
  for select to authenticated using (user_id = (select auth.uid()));

-- communities: cualquiera ve las activas; solo admins gestionan
create policy "communities: read active" on public.communities
  for select to anon, authenticated
  using (archived_at is null or (select public.is_admin()));
create policy "communities: admin insert" on public.communities
  for insert to authenticated with check ((select public.is_admin()));
create policy "communities: admin update" on public.communities
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "communities: admin delete" on public.communities
  for delete to authenticated using ((select public.is_admin()));

-- community_members: cada usuario ve, crea y borra solo sus membresías
create policy "members: read own" on public.community_members
  for select to authenticated using (user_id = (select auth.uid()));
create policy "members: join" on public.community_members
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and role = 'member'
    and exists (
      select 1 from public.communities c
      where c.id = community_id and c.archived_at is null
    )
  );
create policy "members: leave" on public.community_members
  for delete to authenticated using (user_id = (select auth.uid()));

-- goals: el dueño hace todo con los suyos
create policy "goals: read own" on public.goals
  for select to authenticated using (user_id = (select auth.uid()));
create policy "goals: insert own" on public.goals
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "goals: update own" on public.goals
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "goals: delete own" on public.goals
  for delete to authenticated using (user_id = (select auth.uid()));

-- -----------------------------------------------------------------------------
-- Privilegios por columna (defensa en profundidad además de RLS)
-- -----------------------------------------------------------------------------

revoke all on public.users, public.profiles, public.onboarding_responses,
              public.communities, public.community_members, public.goals,
              public.public_profiles
  from anon, authenticated;

grant select on public.users to authenticated;

grant select on public.profiles to authenticated;
grant update (display_name, bio, age, occupation, occupation_other, focus_areas, visibility)
  on public.profiles to authenticated;

grant select on public.onboarding_responses to authenticated;

grant select on public.communities to anon, authenticated;
grant insert, update, delete on public.communities to authenticated; -- filtrado por RLS (admins)

grant select, delete on public.community_members to authenticated;
grant insert (community_id, user_id) on public.community_members to authenticated;

grant select, delete on public.goals to authenticated;
grant insert (user_id, parent_id, community_id, kind, title, description, visibility, target_date, sort_order)
  on public.goals to authenticated;
grant update (title, description, status, visibility, progress, target_date, completed_at, sort_order, community_id)
  on public.goals to authenticated;

grant select on public.public_profiles to authenticated;
