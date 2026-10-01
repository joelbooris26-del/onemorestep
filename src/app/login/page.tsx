import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { GoogleButton } from "@/features/auth/components/google-button";
import { signInWithGoogle } from "@/features/auth/actions";
import { routes } from "@/config/site";
import { safeRedirectPath } from "@/lib/utils";

export const metadata: Metadata = { title: "Entrar" };

const errors: Record<string, string> = {
  oauth: "No hemos podido conectar con Google. Inténtalo de nuevo.",
  callback: "El inicio de sesión no se ha completado. Inténtalo de nuevo.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const mode = params.mode === "signup" ? "signup" : "login";
  const next = safeRedirectPath(typeof params.next === "string" ? params.next : null, routes.home);
  const error = typeof params.error === "string" ? errors[params.error] : undefined;

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-brand-100/70 to-transparent" />

      <Link
        href={routes.landing}
        className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-white/70 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>

      <div className="relative w-full max-w-sm animate-fade-up text-center">
        <LogoMark className="mx-auto size-14" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-balance">
          {mode === "signup" ? "Tu primer paso empieza aquí" : "Bienvenido de nuevo"}
        </h1>
        <p className="mt-3 text-ink-600 text-pretty">
          {mode === "signup"
            ? "Crea tu cuenta en segundos con Google. Después te haremos unas preguntas rápidas para conocerte."
            : "Entra con tu cuenta de Google para seguir dando pasos."}
        </p>

        {error && (
          <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form action={signInWithGoogle} className="mt-8">
          <input type="hidden" name="next" value={next} />
          <GoogleButton />
        </form>

        <p className="mt-6 text-xs leading-relaxed text-ink-500">
          Al continuar aceptas las condiciones de uso de One More Step. Nunca publicaremos nada en tu
          nombre.
        </p>
      </div>
    </main>
  );
}
