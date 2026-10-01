import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { requireOnboardedUser } from "@/features/auth/session";
import { getMainGoal } from "@/features/goals/queries";
import { MainGoalCard } from "@/features/goals/components/main-goal-card";
import { listCommunitiesForUser } from "@/features/communities/queries";
import { CommunityCard } from "@/features/communities/components/community-card";
import { CommunityIcon } from "@/features/communities/components/community-icon";
import { routes } from "@/config/site";
import { firstName } from "@/lib/utils";

export const metadata: Metadata = { title: "Inicio" };

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("es-ES", { hour: "numeric", hour12: false, timeZone: "Europe/Madrid" }).format(new Date()),
  );
  if (hour < 13) return "Buenos días";
  if (hour < 21) return "Buenas tardes";
  return "Buenas noches";
}

export default async function HomePage() {
  const user = await requireOnboardedUser();
  const [goal, communities] = await Promise.all([getMainGoal(user.id), listCommunitiesForUser(user.id)]);

  const mine = communities.filter((c) => c.isMember);
  const suggestions = communities.filter((c) => !c.isMember).slice(0, 3);

  return (
    <div className="space-y-10 animate-fade-up">
      <header>
        <p className="text-sm font-medium text-ink-500">{greeting()},</p>
        <h1 className="text-3xl font-bold tracking-tight">{firstName(user.profile.display_name)} 👋</h1>
        <p className="mt-2 text-ink-600">Hoy no tienes que hacerlo todo. Solo dar un paso más.</p>
      </header>

      <section>
        {goal ? (
          <MainGoalCard goal={goal} />
        ) : (
          <EmptyState icon="🎯" title="Aún no tienes un objetivo principal" description="Define qué quieres conseguir para empezar a dar pasos." />
        )}
      </section>

      <section>
        <SectionTitle
          title="Mis comunidades"
          action={
            <Link href={routes.communities} className="text-sm font-semibold text-brand-700 hover:underline">
              Ver todas
            </Link>
          }
        />
        {mine.length > 0 ? (
          <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {mine.map((c) => (
              <li key={c.id} className="w-36 shrink-0 snap-start sm:w-auto">
                <Link
                  href={routes.community(c.slug)}
                  className="flex h-full flex-col gap-3 rounded-2xl border border-ink-200/80 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CommunityIcon icon={c.icon} color={c.color} size="sm" />
                  <span className="text-sm font-semibold leading-tight">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon="🧭"
            title="Todavía no estás en ninguna comunidad"
            action={<ButtonLink href={routes.discover} size="sm">Descubrir comunidades</ButtonLink>}
          />
        )}
      </section>

      {suggestions.length > 0 && (
        <section>
          <SectionTitle
            title="Descubre"
            action={
              <Link href={routes.discover} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
                Más <ArrowRight className="size-4" />
              </Link>
            }
          />
          <div className="grid gap-3">
            {suggestions.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
