import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { listActiveCommunities } from "@/features/communities/queries";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { routes } from "@/config/site";

export const metadata: Metadata = { title: "Conozcámonos" };

export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.account.onboarding_completed_at) redirect(routes.home);

  const communities = await listActiveCommunities();

  return (
    <OnboardingFlow
      userId={user.id}
      defaultName={user.profile.display_name}
      communities={communities.map(({ id, slug, name, icon, color, description }) => ({
        id,
        slug,
        name,
        icon,
        color,
        description,
      }))}
    />
  );
}
