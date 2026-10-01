import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { requireOnboardedUser } from "@/features/auth/session";
import { getCommunityForUser } from "@/features/communities/queries";
import { CommunityIcon } from "@/features/communities/components/community-icon";
import { MembershipButton } from "@/features/communities/components/membership-button";
import { routes } from "@/config/site";
import { formatMembers } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/communities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()) };
}

export default async function CommunityPage({ params }: PageProps<"/communities/[slug]">) {
  const user = await requireOnboardedUser();
  const { slug } = await params;
  const community = await getCommunityForUser(slug, user.id);
  if (!community) notFound();

  return (
    <div className="animate-fade-up">
      <Link href={routes.communities} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft className="size-4" /> Comunidades
      </Link>

      <Card className="relative mt-4 overflow-hidden p-0 sm:p-0">
        <div aria-hidden className="h-24 sm:h-32" style={{ background: `linear-gradient(135deg, ${community.color}33, ${community.color}0d)` }} />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-10 flex items-end justify-between gap-4 sm:-mt-12">
            <CommunityIcon icon={community.icon} color={community.color} size="lg" className="bg-white ring-4 ring-white" />
            <MembershipButton communityId={community.id} isMember={community.isMember} size="md" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{community.name}</h1>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500">
            <Users className="size-4" /> {formatMembers(community.member_count)}
          </p>
          <p className="mt-4 text-ink-700">{community.description}</p>
        </div>
      </Card>

      {/* Aquí irán publicaciones, retos, eventos y recursos de la comunidad. */}
      <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-ink-300 bg-white/60 px-6 py-10 text-center">
        <p className="text-2xl">🌱</p>
        <p className="mt-2 font-semibold">Esta comunidad está empezando a crecer</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">
          Muy pronto podrás compartir tus avances y ver los de otros miembros aquí.
        </p>
      </div>
    </div>
  );
}
