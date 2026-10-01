"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import type { CommunitySummary } from "@/features/communities/types";
import { CommunityIcon } from "@/features/communities/components/community-icon";
import { completeOnboarding } from "../actions";
import { onboardingFields, type OnboardingInput } from "../schema";
import { onboardingSteps, type StepConfig } from "../steps";
import type { Option } from "../options";

type Draft = Partial<Record<keyof OnboardingInput, string | string[]>>;
type OnboardingCommunity = CommunitySummary & { id: string; description: string };

const DRAFT_KEY = (userId: string) => `oms:onboarding:${userId}`;

function readDraft(userId: string): { draft: Draft; step: number } | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDraft(userId: string, value: { draft: Draft; step: number } | null) {
  try {
    if (value) window.localStorage.setItem(DRAFT_KEY(userId), JSON.stringify(value));
    else window.localStorage.removeItem(DRAFT_KEY(userId));
  } catch {
    // Almacenamiento no disponible (modo privado): el flujo funciona igual.
  }
}

function validateStep(step: StepConfig, draft: Draft): string | null {
  const value = draft[step.field];
  if (step.optional && (value === undefined || value === "")) return null;

  const result = onboardingFields[step.field].safeParse(value ?? (step.kind === "multi" || step.kind === "communities" ? [] : ""));
  if (!result.success) return result.error.issues[0]?.message ?? "Revisa este campo.";

  if (step.otherField) {
    const selected = Array.isArray(value) ? value.includes("other") : value === "other";
    const other = String(draft[step.otherField] ?? "").trim();
    if (selected && !other) return "Cuéntanos un poco más en el campo de texto.";
  }
  return null;
}

export function OnboardingFlow({
  userId,
  defaultName,
  communities,
}: {
  userId: string;
  defaultName: string;
  communities: OnboardingCommunity[];
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>({ name: defaultName });
  const [error, setError] = useState<string | null>(null);
  const [submitting, startSubmit] = useTransition();
  const hydrated = useRef(false);
  const autoAdvance = useRef<number | null>(null);

  const total = onboardingSteps.length;
  const step = onboardingSteps[stepIndex];
  const isLast = stepIndex === total - 1;

  // Recupera el borrador si el usuario cerró la pestaña a mitad.
  useEffect(() => {
    const saved = readDraft(userId);
    if (saved) {
      // Las comunidades pueden haber cambiado desde que se guardó el borrador.
      const validIds = new Set(communities.map((c) => c.id));
      const ids = Array.isArray(saved.draft.community_ids) ? saved.draft.community_ids.filter((id) => validIds.has(id)) : undefined;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación única desde localStorage
      setDraft({ ...saved.draft, community_ids: ids });
      setStepIndex(Math.min(saved.step, total - 1));
    }
    hydrated.current = true;
  }, [userId, communities, total]);

  useEffect(() => {
    if (hydrated.current) writeDraft(userId, { draft, step: stepIndex });
  }, [userId, draft, stepIndex]);

  function update(field: keyof OnboardingInput, value: string | string[]) {
    setError(null);
    setDraft((d) => ({ ...d, [field]: value }));
  }

  function goNext(currentDraft: Draft = draft) {
    const problem = validateStep(step, currentDraft);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    if (!isLast) {
      // Solo avanza desde la pantalla en la que se pidió (evita saltos dobles).
      setStepIndex((i) => (i === stepIndex ? i + 1 : i));
      return;
    }
    writeDraft(userId, null);
    startSubmit(async () => {
      const result = await completeOnboarding(currentDraft as unknown as OnboardingInput);
      // Solo vuelve si hubo error: el éxito redirige a la bienvenida.
      if (result && !result.ok) {
        setError(result.error);
        writeDraft(userId, { draft: currentDraft, step: stepIndex });
      }
    });
  }

  function goBack() {
    if (autoAdvance.current) window.clearTimeout(autoAdvance.current);
    setError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  /** Respuesta única: se avanza sola salvo que sea "Otro". */
  function chooseSingle(value: string) {
    const nextDraft = { ...draft, [step.field]: value };
    setDraft(nextDraft);
    setError(null);
    if (autoAdvance.current) window.clearTimeout(autoAdvance.current);
    if (value !== "other") {
      // Pequeña pausa para que se vea la selección antes de pasar de pantalla.
      autoAdvance.current = window.setTimeout(() => goNext(nextDraft), 220);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Cabecera fija con progreso */}
      <header className="sticky top-0 z-20 bg-ink-50/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0 || submitting}
            aria-label="Volver"
            className="inline-flex size-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-ink-100 disabled:invisible"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1">
            <ProgressBar value={stepIndex + 1} max={total} label="Progreso del onboarding" />
          </div>
          <span className="w-12 text-right text-sm font-semibold tabular-nums text-ink-500">
            {stepIndex + 1}/{total}
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-32 pt-6 sm:px-6 sm:pt-12">
        <div key={step.id} className="animate-step-in">
          <LogoMark className="mb-6 hidden size-10 sm:block" />
          <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{step.title}</h1>
          {step.subtitle && <p className="mt-2 text-ink-600">{step.subtitle}</p>}

          <div className="mt-8">
            <StepInput
              step={step}
              draft={draft}
              communities={communities}
              onChange={update}
              onChooseSingle={chooseSingle}
              onSubmit={() => goNext()}
            />
          </div>

          {error && (
            <p role="alert" className="mt-4 animate-pop text-sm font-medium text-red-600">
              {error}
            </p>
          )}
        </div>
      </main>

      {/* Barra inferior: el pulgar llega fácil en móvil */}
      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-200/70 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {step.optional ? (
            <Button
              variant="ghost"
              onClick={() => {
                const cleared = { ...draft, [step.field]: "" };
                setDraft(cleared);
                goNext(cleared);
              }}
              disabled={submitting}
            >
              Saltar
            </Button>
          ) : (
            <span />
          )}
          <Button size="lg" onClick={() => goNext()} disabled={submitting} className="min-w-40">
            {submitting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isLast ? (
              <>
                Terminar <Check className="size-5" />
              </>
            ) : (
              <>
                Continuar <ArrowRight className="size-5" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function StepInput({
  step,
  draft,
  communities,
  onChange,
  onChooseSingle,
  onSubmit,
}: {
  step: StepConfig;
  draft: Draft;
  communities: OnboardingCommunity[];
  onChange: (field: keyof OnboardingInput, value: string | string[]) => void;
  onChooseSingle: (value: string) => void;
  onSubmit: () => void;
}) {
  const value = draft[step.field];
  const asString = typeof value === "string" ? value : "";
  const asArray = Array.isArray(value) ? value : [];

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const toggle = (v: string) =>
    onChange(step.field, asArray.includes(v) ? asArray.filter((x) => x !== v) : [...asArray, v]);

  const otherInput =
    step.otherField &&
    (asString === "other" || asArray.includes("other")) && (
      <Input
        autoFocus
        className="mt-3 animate-fade-up"
        placeholder={step.otherPlaceholder}
        maxLength={80}
        value={String(draft[step.otherField] ?? "")}
        onChange={(e) => onChange(step.otherField!, e.target.value)}
        onKeyDown={onEnter}
      />
    );

  switch (step.kind) {
    case "text":
      return (
        <Input
          autoFocus
          placeholder={step.placeholder}
          maxLength={step.field === "name" ? 50 : 200}
          value={asString}
          onChange={(e) => onChange(step.field, e.target.value)}
          onKeyDown={onEnter}
          className="text-lg"
        />
      );
    case "textarea":
      return (
        <Textarea
          autoFocus
          placeholder={step.placeholder}
          maxLength={step.field === "motivation" ? 500 : 200}
          value={asString}
          onChange={(e) => onChange(step.field, e.target.value)}
          onKeyDown={onEnter}
          className="text-lg"
        />
      );
    case "number":
      return (
        <Input
          autoFocus
          type="number"
          inputMode="numeric"
          min={13}
          max={120}
          placeholder={step.placeholder}
          value={asString}
          onChange={(e) => onChange(step.field, e.target.value.replace(/\D/g, "").slice(0, 3))}
          onKeyDown={onEnter}
          className="max-w-40 text-center text-2xl font-semibold"
        />
      );
    case "single":
    case "privacy":
      return (
        <div className="grid gap-2.5">
          {step.options!.map((o) => (
            <OptionCard key={o.value} option={o} selected={asString === o.value} onClick={() => onChooseSingle(o.value)} />
          ))}
          {otherInput}
        </div>
      );
    case "multi":
      return (
        <div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {step.options!.map((o) => (
              <OptionCard key={o.value} option={o} selected={asArray.includes(o.value)} onClick={() => toggle(o.value)} multi />
            ))}
          </div>
          {otherInput}
        </div>
      );
    case "communities":
      return (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {communities.map((c) => {
            const selected = asArray.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                aria-pressed={selected}
                className={cn(
                  "relative flex flex-col items-start gap-3 rounded-2xl border-2 bg-white p-4 text-left transition-all active:scale-[0.98]",
                  selected ? "border-brand-500 bg-brand-50/50 shadow-sm" : "border-ink-200/80 hover:border-ink-300",
                )}
              >
                <CommunityIcon icon={c.icon} color={c.color} size="sm" />
                <span className="text-sm font-semibold leading-tight">{c.name}</span>
                {selected && (
                  <span className="absolute right-3 top-3 inline-flex size-5 animate-pop items-center justify-center rounded-full bg-brand-500 text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      );
  }
}

function OptionCard({
  option,
  selected,
  onClick,
  multi = false,
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-left transition-all active:scale-[0.99]",
        selected ? "border-brand-500 bg-brand-50/50 shadow-sm" : "border-ink-200/80 hover:border-ink-300",
      )}
    >
      {option.emoji && <span className="text-xl">{option.emoji}</span>}
      <span className="flex-1">
        <span className="block font-medium leading-snug">{option.label}</span>
        {option.description && <span className="mt-0.5 block text-sm text-ink-500">{option.description}</span>}
      </span>
      <span
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center border-2 transition-colors",
          multi ? "rounded-lg" : "rounded-full",
          selected ? "border-brand-500 bg-brand-500 text-white" : "border-ink-300",
        )}
      >
        {selected && <Check className="size-3.5" strokeWidth={3} />}
      </span>
    </button>
  );
}
