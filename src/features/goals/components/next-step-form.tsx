"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addStep } from "../actions";

export function NextStepForm({ goalId, highlight }: { goalId: string; highlight: boolean }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addStep(goalId, title);
      if (result.ok) {
        setTitle("");
        inputRef.current?.blur();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={submit} className="mt-4">
      {highlight && (
        <p className="mb-2 text-sm font-semibold text-brand-700">¡Paso completado! ¿Cuál es el siguiente?</p>
      )}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Añade tu siguiente paso…"
          maxLength={200}
          className="h-12 text-[0.95rem]"
          aria-label="Siguiente paso"
        />
        <Button type="submit" disabled={pending || !title.trim()} className="h-12 shrink-0 px-4" aria-label="Añadir paso">
          {pending ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
