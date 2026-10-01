import { redirect } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getSessionUser } from "@/features/auth/session";
import { features, howItWorks } from "@/features/landing/content";
import { CommunityIcon } from "@/features/communities/components/community-icon";
import { listActiveCommunities } from "@/features/communities/queries";
import { routes } from "@/config/site";

const signupHref = `${routes.login}?mode=signup`;

export default async function LandingPage() {
  const user = await getSessionUser();
  if (user) redirect(routes.home);

  const communities = await listActiveCommunities().catch(() => []);

  return (
    <div className="overflow-x-clip">
      {/* Cabecera */}
      <header className="sticky top-0 z-30 border-b border-transparent bg-ink-50/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1 sm:gap-2">
            <ButtonLink href={routes.login} variant="ghost" size="sm">
              Iniciar sesión
            </ButtonLink>
            <ButtonLink href={signupHref} size="sm" className="hidden sm:inline-flex">
              Empezar ahora
            </ButtonLink>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-16 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-brand-100),transparent)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24 lg:pt-24">
            <div className="animate-fade-up text-center lg:text-left">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-semibold text-brand-700">
                <span className="size-1.5 rounded-full bg-brand-500" /> Un paso más, cada día
              </p>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Cada objetivo empieza con <span className="text-brand-600">un paso.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-ink-600 text-pretty lg:mx-0">
                No necesitas cambiar tu vida de golpe. Solo necesitas dar <strong className="text-ink-900">One More Step</strong>.
                Fija tus objetivos, sigue tu progreso y avanza junto a personas que van en la misma dirección.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <ButtonLink href={signupHref} size="lg">
                  Empezar ahora <ArrowRight className="size-5" />
                </ButtonLink>
                <ButtonLink href={routes.login} size="lg" variant="outline">
                  Iniciar sesión
                </ButtonLink>
              </div>
              <p className="mt-4 text-sm text-ink-500">Gratis. Entras con Google en segundos.</p>
            </div>

            <HeroPreview />
          </div>
        </section>

        {/* Qué puedes hacer */}
        <section className="border-y border-ink-200/70 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Todo lo que necesitas para no rendirte</h2>
              <p className="mt-3 text-lg text-ink-600">
                Objetivos claros, constancia visible y una comunidad que tira de ti cuando falta motivación.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-[var(--radius-card)] border border-ink-200/80 bg-ink-50/60 p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comunidades */}
        {communities.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Encuentra tu gente</h2>
              <p className="mx-auto mt-3 max-w-xl text-lg text-ink-600">
                Únete a las comunidades que encajan con lo que quieres conseguir. Puedes estar en todas las que quieras.
              </p>
            </div>
            <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5">
              {communities.map((c) => (
                <li
                  key={c.id}
                  className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium"
                >
                  <CommunityIcon icon={c.icon} color={c.color} size="sm" className="size-8 rounded-full text-base" />
                  {c.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Cómo funciona */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Así de simple</h2>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {howItWorks.map((step, i) => (
                <li key={step.title} className="relative rounded-[var(--radius-card)] border border-ink-200/80 p-6">
                  <span className="text-sm font-bold text-brand-600">Paso {i + 1}</span>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-ink-900 px-6 py-14 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Tu próximo paso puede ser hoy.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-ink-300">
              No hace falta tenerlo todo claro. Empieza con un objetivo y un primer paso pequeño.
            </p>
            <ButtonLink href={signupHref} size="lg" variant="secondary" className="mt-8">
              Empezar ahora <ArrowRight className="size-5" />
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-200/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-ink-500 sm:flex-row sm:px-6">
          <Logo className="text-ink-900" />
          <p>© {new Date().getFullYear()} One More Step. Un paso más, cada día.</p>
        </div>
      </footer>
    </div>
  );
}

/** Ilustración del producto hecha con la propia UI (sin imágenes). */
function HeroPreview() {
  const steps = [
    { title: "Apuntarme al gimnasio", done: true },
    { title: "Entrenar 3 veces esta semana", done: true },
    { title: "Preparar comidas del lunes", done: false },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:120ms]">
      <div aria-hidden className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-200/60 via-white to-ink-100 blur-2xl" />
      <div className="rounded-[1.75rem] border border-ink-200 bg-white p-5 shadow-xl shadow-ink-900/5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-brand-100 text-xl">🌱</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Objetivo principal</p>
            <p className="font-semibold">Ponerme en forma este año</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="font-medium text-ink-600">Progreso</span>
          <span className="font-semibold text-brand-700">2 de 3 pasos</span>
        </div>
        <ProgressBar value={66} className="mt-2" />
        <ul className="mt-5 space-y-2.5">
          {steps.map((s) => (
            <li
              key={s.title}
              className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm ${s.done ? "border-transparent bg-ink-50 text-ink-500" : "border-brand-200 bg-brand-50/60 font-medium"}`}
            >
              <span
                className={`inline-flex size-6 items-center justify-center rounded-full ${s.done ? "bg-brand-500 text-white" : "border-2 border-brand-400"}`}
              >
                {s.done && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span className={s.done ? "line-through decoration-ink-300" : ""}>{s.title}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-2xl bg-ink-900 px-4 py-3 text-center text-sm font-semibold text-white">
          Siguiente paso → One More Step
        </p>
      </div>
    </div>
  );
}
