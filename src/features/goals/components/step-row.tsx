"use client";

import { useOptimistic, useTransition } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { setStepDone } from "../actions";

export function StepRow({ id, title, done }: { id: string; title: string; done: boolean }) {
  const [optimisticDone, setOptimisticDone] = useOptimistic(done);
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      setOptimisticDone(!optimisticDone);
      await setStepDone(id, !optimisticDone);
    });
  }

  return (
    <li>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={optimisticDone}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all active:scale-[0.99]",
          optimisticDone
            ? "border-transparent bg-ink-50 text-ink-500"
            : "border-brand-200 bg-brand-50/60 font-medium hover:border-brand-300",
        )}
      >
        <span
          className={cn(
            "inline-flex size-7 shrink-0 items-center justify-center rounded-full transition-all",
            optimisticDone ? "animate-pop bg-brand-500 text-white" : "border-2 border-brand-400 bg-white",
          )}
        >
          {optimisticDone && <Check className="size-4" strokeWidth={3} />}
        </span>
        <span className={cn("flex-1", optimisticDone && "line-through decoration-ink-300")}>{title}</span>
        {!optimisticDone && <span className="hidden text-xs font-semibold text-brand-700 sm:inline">Marcar como hecho</span>}
      </button>
    </li>
  );
}
