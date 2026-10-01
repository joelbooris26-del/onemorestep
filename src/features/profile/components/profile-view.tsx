import Link from "next/link";
import { Briefcase, CalendarDays, Cake, Footprints, Target } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card, SectionTitle } from "@/components/ui/card";
import { routes } from "@/config/site";
import { formatJoinedDate } from "@/lib/utils";
import { CommunityIcon } from "@/features/communities/components/community-icon";
import { visibilityCopy } from "../mappers";
import type { ProfileViewData } from "../types";

/**
 * Vista de perfil reutilizable (propio y ajeno).
 * Secciones futuras (seguidores, publicaciones, logros, rachas…) se añaden aquí.
 */
export function ProfileView({
  profile,
  actions,
  isOwn = false,
}: {
  profile: ProfileViewData;
  actions?: React.ReactNode;
  isOwn?: boolean;
}) {
  const vis = visibilityCopy[profile.visibility];
  const hidden = !isOwn && profile.visibility === "private";

  return (
    <div className="space-y-6 animate-fade-up">
      <Card className="overflow-hidden p-0 sm:p-0">
        <div aria-hidden className="h-24 bg-gradient-to-br from-brand-200 via-brand-100 to-ink-100 sm:h-32" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-10 flex items-end justify-between gap-4 sm:-mt-12">
            <Avatar src={profile.avatarUrl} name={profile.displayName} size="lg" className="ring-4" />
            {actions}
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">{profile.displayName}</h1>
          <p className="text-ink-500">@{profile.username}</p>

          {profile.bio && <p className="mt-4 whitespace-pre-line text-ink-700">{profile.bio}</p>}

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-500">
            {profile.occupation && (
              <li className="inline-flex items-center gap-1.5">
                <Briefcase className="size-4" /> {profile.occupation}
              </li>
            )}
            {profile.age !== null && (
              <li className="inline-flex items-center gap-1.5">
                <Cake className="size-4" /> {profile.age} años
              </li>
            )}
            <li className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" /> En One More Step desde {formatJoinedDate(profile.joinedAt)}
            </li>
          </ul>

          {isOwn && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600">
              {vis.emoji} {vis.label}
            </p>
          )}
        </div>
      </Card>

      {hidden ? (
        <Card className="text-center">
          <p className="text-2xl">🔒</p>
          <p className="mt-2 font-semibold">Este perfil es privado</p>
          <p className="mt-1 text-sm text-ink-500">{profile.displayName} prefiere mantener su progreso para sí.</p>
        </Card>
      ) : (
        <>
          {/* Estadísticas: aquí se sumarán rachas, logros, seguidores… */}
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={<Footprints className="size-5" />} value={profile.stepsCompleted} label="Pasos dados" />
            <Stat icon={<span className="text-lg">🧭</span>} value={profile.communities.length} label="Comunidades" />
          </div>

          {(profile.mainGoal || profile.secondaryGoals.length > 0) && (
            <Card>
              {profile.mainGoal && (
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                    <Target className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Objetivo principal</p>
                    <p className="mt-0.5 font-semibold">{profile.mainGoal}</p>
                  </div>
                </div>
              )}
              {profile.secondaryGoals.length > 0 && (
                <div className={profile.mainGoal ? "mt-5" : ""}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Objetivos secundarios</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {profile.secondaryGoals.map((g) => (
                      <li key={g} className="rounded-full bg-ink-100 px-3 py-1.5 text-sm font-medium text-ink-700">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {profile.communities.length > 0 && (
            <section>
              <SectionTitle title="Comunidades" />
              <ul className="flex flex-wrap gap-2">
                {profile.communities.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={routes.community(c.slug)}
                      className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-3.5 text-sm font-medium transition-colors hover:border-ink-300"
                    >
                      <CommunityIcon icon={c.icon} color={c.color} size="sm" className="size-7 rounded-full text-sm" />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <Card className="flex items-center gap-3 p-4 sm:p-5">
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-ink-100 text-ink-700">{icon}</span>
      <span>
        <span className="block text-xl font-bold tabular-nums">{value}</span>
        <span className="block text-xs font-medium text-ink-500">{label}</span>
      </span>
    </Card>
  );
}
