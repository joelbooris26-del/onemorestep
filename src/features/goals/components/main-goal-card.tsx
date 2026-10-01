import { Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { MainGoalWithSteps } from "../types";
import { NextStepForm } from "./next-step-form";
import { StepRow } from "./step-row";

export function MainGoalCard({ goal }: { goal: MainGoalWithSteps }) {
  const done = goal.steps.filter((s) => s.status === "completed").length;
  const total = goal.steps.length;
  const allDone = total > 0 && done === total;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <Target className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Objetivo principal</p>
          <h2 className="mt-0.5 text-lg font-semibold leading-snug text-balance">{goal.title}</h2>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="font-medium text-ink-600">Pasos dados</span>
        <span className="font-semibold tabular-nums text-brand-700">
          {done} de {total}
        </span>
      </div>
      <ProgressBar value={done} max={Math.max(total, 1)} className="mt-2" label="Pasos completados" />

      {total > 0 && (
        <ul className="mt-5 space-y-2.5">
          {goal.steps.map((s) => (
            <StepRow key={s.id} id={s.id} title={s.title} done={s.status === "completed"} />
          ))}
        </ul>
      )}

      <NextStepForm goalId={goal.id} highlight={allDone} />
    </Card>
  );
}
