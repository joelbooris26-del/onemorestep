import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { requireOnboardedUser } from "@/features/auth/session";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { routes } from "@/config/site";

export const metadata: Metadata = { title: "Editar perfil" };

export default async function EditProfilePage() {
  const { profile } = await requireOnboardedUser();

  return (
    <div className="animate-fade-up">
      <Link href={routes.profile} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft className="size-4" /> Mi perfil
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Editar perfil</h1>
      <Card className="mt-6">
        <ProfileForm defaults={{ display_name: profile.display_name, bio: profile.bio, visibility: profile.visibility }} />
      </Card>
    </div>
  );
}
