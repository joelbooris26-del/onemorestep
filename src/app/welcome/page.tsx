import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { requireOnboardedUser } from "@/features/auth/session";
import { routes } from "@/config/site";
import { firstName } from "@/lib/utils";

export const metadata: Metadata = { title: "Bienvenido" };

export default async function WelcomePage() {
  const user = await requireOnboardedUser();
  const name = firstName(user.profile.display_name);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-ink-900 px-4 py-16 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_100%,rgba(16,185,129,0.35),transparent)]" />

      {/* Escalones decorativos */}
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end gap-3 opacity-20">
        {[40, 80, 120, 160, 200].map((h, i) => (
          <span
            key={h}
            className="w-10 animate-fade-up rounded-t-xl bg-brand-400 sm:w-16"
            style={{ height: h, animationDelay: `${150 + i * 90}ms` }}
          />
        ))}
      </div>

      <div className="relative max-w-lg text-center">
        <LogoMark className="mx-auto size-14 animate-fade-up" />
        <h1 className="mt-8 animate-fade-up text-3xl font-extrabold tracking-tight text-balance [animation-delay:100ms] sm:text-5xl">
          Bienvenido a One More Step, <span className="text-brand-400">{name}</span>.
        </h1>
        <div className="mt-6 animate-fade-up space-y-1 text-lg text-ink-300 [animation-delay:250ms] sm:text-xl">
          <p className="font-semibold text-white">Tu objetivo empieza ahora.</p>
          <p>No necesitas hacerlo todo hoy.</p>
          <p>Solo necesitas dar el siguiente paso.</p>
        </div>
        <ButtonLink
          href={routes.home}
          size="lg"
          variant="secondary"
          className="mt-10 w-full animate-fade-up [animation-delay:400ms] sm:w-auto sm:min-w-56"
        >
          Comenzar <ArrowRight className="size-5" />
        </ButtonLink>
      </div>
    </main>
  );
}
