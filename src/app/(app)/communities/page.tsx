import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { requireOnboardedUser } from "@/features/auth/session";
import { listCommunitiesForUser } from "@/features/communities/queries";
import { CommunityCard } from "@/features/communities/components/community-card";
import { routes } from "@/config/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Comunidades" };

const tabs = [
  { id: "mine", label: "Mis comunidades" },
  { id: "discover", label: "Descubrir" },
] as const;

export default async function CommunitiesPage({ searchParams }: PageProps<"/communities">) {
  const user = await requireOnboardedUser();
  const { tab: rawTab } = await searchParams;
  const tab = rawTab === "discover" ? "discover" : "mine";

  const communities = await listCommunitiesForUser(user.id);
  const mine = communities.filter((c) => c.isMember);
  const others = communities.filter((c) => !c.isMember);
  const list = tab === "mine" ? mine : others;

  return (
    <div className="animate-fade-up">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Comunidades</h1>
        <p className="mt-2 text-ink-600">Rodéate de personas que van en tu misma dirección.</p>
      </header>

      <div role="tablist" className="mt-6 inline-flex w-full rounded-full bg-ink-100 p-1 sm:w-auto">
        {tabs.map((t) => {
          const count = t.id === "mine" ? mine.length : others.length;
          return (
            <Link
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              href={t.id === "mine" ? routes.communities : routes.discover}
              scroll={false}
              className={cn(
                "flex-1 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-all sm:flex-none",
                tab === t.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-900",
              )}
            >
              {t.label} <span className="ml-1 text-ink-400">{count}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3">
        {list.length > 0 ? (
          list.map((c) => <CommunityCard key={c.id} community={c} />)
        ) : tab === "mine" ? (
          <EmptyState
            icon="🧭"
            title="Aún no te has unido a ninguna comunidad"
            description="Explora las comunidades y únete a las que encajen con tus objetivos."
            action={
              <Link href={routes.discover} className="font-semibold text-brand-700 hover:underline">
                Descubrir comunidades
              </Link>
            }
          />
        ) : (
          <EmptyState icon="🎉" title="¡Ya estás en todas las comunidades!" description="Pronto habrá más." />
        )}
      </div>
    </div>
  );
}
