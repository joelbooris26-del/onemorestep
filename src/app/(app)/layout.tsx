import { AppShell } from "@/components/layout/app-shell";
import { requireOnboardedUser } from "@/features/auth/session";

/** Todo lo que cuelga de (app) exige sesión y onboarding completado. */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const { profile } = await requireOnboardedUser();
  return (
    <AppShell
      user={{ displayName: profile.display_name, username: profile.username, avatarUrl: profile.avatar_url }}
    >
      {children}
    </AppShell>
  );
}
