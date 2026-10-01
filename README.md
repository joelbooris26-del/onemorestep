# One More Step

> Cada objetivo empieza con un paso.

Web app (móvil + escritorio) para crear objetivos, seguir el progreso y unirse a comunidades de personas con metas parecidas.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Postgres + Auth con Google) · Vercel.

## Qué incluye la fase 1

- Landing pública responsive.
- Login con Google (Supabase Auth, flujo PKCE con cookies).
- Onboarding de 12 pantallas con barra de progreso, borrador guardado si se cierra la pestaña y pantalla de bienvenida.
- Inicio: objetivo principal, pasos (marcar como hecho y añadir el siguiente), mis comunidades y sugerencias.
- Comunidades: listado, descubrir, detalle, unirse/salir y número de miembros.
- Perfil propio, edición (nombre, bio, privacidad) y perfil de otros usuarios filtrado por privacidad.
- Base de datos con Row Level Security en todas las tablas.

## Puesta en marcha

### 1. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com) (región `eu-west`).
2. **SQL Editor** → pega y ejecuta `supabase/migrations/20261001000000_init.sql`.
3. Ejecuta después `supabase/seed.sql` (crea las 17 comunidades iniciales).
4. **Project Settings → API**: copia la *Project URL* y la *Publishable key*.

### 2. Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) → APIs y servicios → **Pantalla de consentimiento OAuth** (tipo *Externo*, rellena nombre y email).
2. **Credenciales → Crear credenciales → ID de cliente OAuth → Aplicación web**.
3. En *URIs de redireccionamiento autorizados* añade:
   `https://<TU-PROYECTO>.supabase.co/auth/v1/callback`
4. Copia el *Client ID* y el *Client secret*.
5. Supabase → **Authentication → Sign In / Providers → Google**: actívalo y pega ambos.
6. Supabase → **Authentication → URL Configuration**:
   - *Site URL*: `http://localhost:3000` (en producción, tu dominio).
   - *Redirect URLs*: `http://localhost:3000/auth/callback` y `https://<tu-dominio>/auth/callback`.

### 3. Local

```bash
cp .env.example .env.local   # rellena las 3 variables
npm install
npm run dev                  # http://localhost:3000
```

### 4. Producción (Vercel)

1. Importa el repo en Vercel.
2. Añade las variables de `.env.example` (con `NEXT_PUBLIC_SITE_URL=https://<tu-dominio>`).
3. Añade `https://<tu-dominio>/auth/callback` a las *Redirect URLs* de Supabase.

### Hacerte administrador

Para gestionar comunidades (crear/editar/archivar) desde la BD con tu usuario:

```sql
update public.users set role = 'admin' where email = 'tu@email.com';
```

## Estructura

```
src/
  app/                    Rutas (solo composición, sin lógica de negocio)
    page.tsx              Landing
    login/                Login con Google
    auth/callback/        Intercambio del código OAuth
    onboarding/ welcome/  Primer acceso
    (app)/                App autenticada (layout con sidebar / barra inferior)
      home/ communities/ profile/ u/[username]/
  features/               Un módulo por dominio
    auth/                 actions (login/logout), session (usuario actual)
    onboarding/           options, schema (zod), steps (config), flow
    communities/          queries, actions, components
    goals/                queries, actions, components
    profile/              queries, actions, mappers, components
    landing/              textos de la landing
  components/
    ui/                   Botón, tarjeta, input, avatar, barra de progreso…
    layout/               AppShell y navegación
    brand/                Logo
  config/                 site.ts (rutas), navigation.ts (menú)
  lib/supabase/           Clientes de Supabase (browser, server, proxy)
  types/database.ts       Tipos de la BD
  proxy.ts                Refresco de sesión y protección de rutas
supabase/
  migrations/             Esquema versionado
  seed.sql                Comunidades iniciales
```

**Regla para crecer:** cada funcionalidad nueva (posts, follows, rachas, notificaciones, mensajes, búsqueda) es una carpeta nueva en `src/features/`, una migración nueva en `supabase/migrations/` y sus rutas en `src/app/(app)/`. No se tocan las anteriores.

## Base de datos

| Tabla | Para qué | Quién la lee |
|---|---|---|
| `users` | Cuenta: email, rol, onboarding completado | Solo el dueño |
| `profiles` | Nombre, foto, bio, edad, ocupación, privacidad | Solo el dueño (los demás usan `public_profiles`) |
| `onboarding_responses` | Respuestas del onboarding (con `version`) | Solo el dueño |
| `communities` | Comunidades (borrado lógico con `archived_at`) | Todos; solo admins editan |
| `community_members` | Usuario ↔ comunidad, con `role` para futuros moderadores | Solo el dueño de cada fila |
| `goals` | Objetivo principal, secundarios y pasos (`kind`, `parent_id`) | Solo el dueño |

- `public_profiles` (vista): lo que otros ven según la privacidad. `public` muestra todo; `limited` oculta edad y ocupación; `private` solo nombre y foto.
- `complete_onboarding(payload)`: guarda el onboarding, crea el objetivo principal y el primer paso, y une a las comunidades en una sola transacción.
- Triggers: alta automática de `users` + `profiles` al registrarse, `member_count` siempre actualizado y `updated_at`.

Si cambias el esquema, regenera los tipos:

```bash
npx supabase gen types typescript --project-id <id> > src/types/database.ts
```
