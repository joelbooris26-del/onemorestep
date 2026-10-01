import Link from "next/link";
import { Users } from "lucide-react";
import { routes } from "@/config/site";
import { formatMembers } from "@/lib/utils";
import type { CommunityWithMembership } from "../types";
import { CommunityIcon } from "./community-icon";
import { MembershipButton } from "./membership-button";

export function CommunityCard({ community }: { community: CommunityWithMembership }) {
  return (
    <article className="relative flex items-start gap-4 rounded-[var(--radius-card)] border border-ink-200/80 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-md sm:p-5">
      <CommunityIcon icon={community.icon} color={community.color} />
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold leading-tight text-ink-900">
          {/* Enlace "estirado": toda la tarjeta es clicable, el botón queda por encima */}
          <Link href={routes.community(community.slug)} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)]">
            {community.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-500">{community.description}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-ink-500">
          <Users className="size-3.5" /> {formatMembers(community.member_count)}
        </p>
      </div>
      <MembershipButton communityId={community.id} isMember={community.isMember} className="relative z-10" />
    </article>
  );
}
