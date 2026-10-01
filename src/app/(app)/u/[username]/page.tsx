import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireOnboardedUser } from "@/features/auth/session";
import { getPublicProfileView } from "@/features/profile/queries";
import { ProfileView } from "@/features/profile/components/profile-view";
import { routes } from "@/config/site";

export async function generateMetadata({ params }: PageProps<"/u/[username]">): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function UserProfilePage({ params }: PageProps<"/u/[username]">) {
  const user = await requireOnboardedUser();
  const { username } = await params;
  if (username.toLowerCase() === user.profile.username) redirect(routes.profile);

  const profile = await getPublicProfileView(username);
  if (!profile) notFound();

  return <ProfileView profile={profile} />;
}
