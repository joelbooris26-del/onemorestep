import { z } from "zod";
import {
  dailyTimeOptions,
  lifeGoalOptions,
  occupationOptions,
  privacyOptions,
  socialOptions,
  stageOptions,
  valuesOf,
} from "./options";

const text = (max: number) => z.string().trim().max(max);

/** Validación única para cliente (paso a paso) y servidor (envío final). */
const base = z.object({
    name: text(50).min(1, "Escribe cómo quieres que te llamemos."),
    age: z.coerce
      .number({ error: "Indica tu edad." })
      .int("Indica tu edad en años.")
      .min(13, "Debes tener al menos 13 años.")
      .max(120, "Revisa tu edad."),
    occupation: z.enum(valuesOf(occupationOptions), { error: "Elige una opción." }),
    occupation_other: text(60).optional(),
    life_goals: z.array(z.enum(valuesOf(lifeGoalOptions))).min(1, "Elige al menos una opción.").max(16),
    life_goals_other: text(80).optional(),
    main_goal: text(200).min(1, "Escribe tu objetivo principal."),
    stage: z.enum(valuesOf(stageOptions), { error: "Elige una opción." }),
    motivation: text(500).optional(),
    daily_time: z.enum(valuesOf(dailyTimeOptions), { error: "Elige una opción." }),
    social_preferences: z.array(z.enum(valuesOf(socialOptions))).min(1, "Elige al menos una opción.").max(7),
    community_ids: z.array(z.uuid()).min(1, "Elige al menos un tema.").max(50),
    privacy_level: z.enum(valuesOf(privacyOptions), { error: "Elige una opción." }),
    first_step: text(200).min(1, "Escribe tu primer paso."),
});

/** Validadores campo a campo (los usa el flujo para validar cada pantalla). */
export const onboardingFields = base.shape;
export type OnboardingField = keyof typeof onboardingFields;

export const onboardingSchema = base.superRefine((data, ctx) => {
    if (data.occupation === "other" && !data.occupation_other) {
      ctx.addIssue({ code: "custom", path: ["occupation_other"], message: "Cuéntanos a qué te dedicas." });
    }
    if (data.life_goals.includes("other") && !data.life_goals_other) {
      ctx.addIssue({ code: "custom", path: ["life_goals_other"], message: "Cuéntanos qué otro objetivo tienes." });
    }
});

export type OnboardingInput = z.input<typeof onboardingSchema>;
export type OnboardingData = z.output<typeof onboardingSchema>;
