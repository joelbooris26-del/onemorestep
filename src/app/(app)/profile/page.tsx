import type { Metadata } from "next";
import { LogOut, Pencil } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { requireOnboardedUser } from "@/features/auth/session";
import { signOut } from "@/features/auth/actions";
import { getOwnProfileView } from "@/features/profile/queries";
import { ProfileView } from "@/features/profile/components/profile-view";
import { routes } from "@/config/site";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function ProfilePage() {
  const user = await requireOnboardedUser();
  const profile = await getOwnProfileView(user);

  return (
    <>
      <ProfileView
        profile={profile}
        isOwn
        actions={
          <ButtonLink href={routes.profileEdit} variant="outline" size="sm">
            <Pencil className="size-4" /> Editar perfil
          </ButtonLink>
        }
      />
      <form action={signOut} className="mt-8 lg:hidden">
        <button
          type="submit"
          className="mx-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-ink-500 hover:bg-ink-100"
        >
          <LogOut className="size-4" /> Cerrar sesión
        </button>
      </form>
    </>
  );
}
