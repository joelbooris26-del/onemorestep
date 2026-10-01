"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { routes } from "@/config/site";
import { cn } from "@/lib/utils";
import { privacyOptions } from "@/features/onboarding/options";
import type { Visibility } from "@/types/database";
import { updateProfile } from "../actions";

export function ProfileForm({
  defaults,
}: {
  defaults: { display_name: string; bio: string | null; visibility: Visibility };
}) {
  const [state, action, pending] = useActionState(updateProfile, undefined);

  return (
    <form action={action} className="space-y-6">
      <div>
        <Label htmlFor="display_name">Nombre</Label>
        <Input id="display_name" name="display_name" defaultValue={defaults.display_name} maxLength={50} required />
      </div>

      <div>
        <Label htmlFor="bio">Biografía</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={defaults.bio ?? ""}
          maxLength={280}
          placeholder="Cuéntale a los demás quién eres y en qué estás trabajando."
        />
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-semibold text-ink-700">Privacidad</legend>
        <div className="grid gap-2.5">
          {privacyOptions.map((o) => (
            <label
              key={o.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-ink-200/80 bg-white p-4 transition-colors",
                "has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50/50",
              )}
            >
              <input
                type="radio"
                name="visibility"
                value={o.value}
                defaultChecked={defaults.visibility === o.value}
                className="mt-1 size-4 accent-brand-600"
              />
              <span>
                <span className="block font-medium">
                  {o.emoji} {o.label}
                </span>
                <span className="mt-0.5 block text-sm text-ink-500">{o.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <ButtonLink href={routes.profile} variant="ghost">
          Cancelar
        </ButtonLink>
        <Button type="submit" disabled={pending} className="sm:min-w-36">
          {pending ? <Loader2 className="size-5 animate-spin" /> : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
