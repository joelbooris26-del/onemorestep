import {
  dailyTimeOptions,
  lifeGoalOptions,
  occupationOptions,
  privacyOptions,
  socialOptions,
  stageOptions,
  type Option,
} from "./options";
import type { OnboardingField } from "./schema";

/**
 * Definición declarativa de las pantallas del onboarding.
 * Añadir, quitar o reordenar preguntas = editar este array.
 */
export type StepKind = "text" | "textarea" | "number" | "single" | "multi" | "communities" | "privacy";

export type StepConfig = {
  id: string;
  field: OnboardingField;
  kind: StepKind;
  title: string;
  subtitle?: string;
  placeholder?: string;
  optional?: boolean;
  options?: readonly Option[];
  /** Campo de texto libre que aparece al elegir "Otro". */
  otherField?: OnboardingField;
  otherPlaceholder?: string;
};

export const onboardingSteps: StepConfig[] = [
  {
    id: "name",
    field: "name",
    kind: "text",
    title: "¿Cómo quieres que te llamemos?",
    subtitle: "Así te verán los demás dentro de One More Step.",
    placeholder: "Tu nombre",
  },
  {
    id: "age",
    field: "age",
    kind: "number",
    title: "¿Cuántos años tienes?",
    subtitle: "Solo se mostrará si eliges un perfil público.",
    placeholder: "Edad",
  },
  {
    id: "occupation",
    field: "occupation",
    kind: "single",
    title: "¿A qué te dedicas actualmente?",
    options: occupationOptions,
    otherField: "occupation_other",
    otherPlaceholder: "Cuéntanos a qué te dedicas",
  },
  {
    id: "life_goals",
    field: "life_goals",
    kind: "multi",
    title: "¿Qué quieres conseguir en esta etapa de tu vida?",
    subtitle: "Puedes elegir varias.",
    options: lifeGoalOptions,
    otherField: "life_goals_other",
    otherPlaceholder: "¿Qué más quieres conseguir?",
  },
  {
    id: "main_goal",
    field: "main_goal",
    kind: "textarea",
    title: "Si solo pudieras conseguir una cosa durante los próximos meses, ¿qué sería?",
    subtitle: "Este será tu objetivo principal. Podrás cambiarlo cuando quieras.",
    placeholder: "Ej.: Lanzar mi primer negocio online",
  },
  {
    id: "stage",
    field: "stage",
    kind: "single",
    title: "¿En qué punto estás ahora mismo?",
    options: stageOptions,
  },
  {
    id: "motivation",
    field: "motivation",
    kind: "textarea",
    title: "¿Qué te ha hecho querer dar este paso ahora?",
    subtitle: "Opcional. Solo lo verás tú.",
    placeholder: "Escribe lo que quieras…",
    optional: true,
  },
  {
    id: "daily_time",
    field: "daily_time",
    kind: "single",
    title: "¿Cuánto tiempo puedes dedicar aproximadamente cada día a tus objetivos?",
    options: dailyTimeOptions,
  },
  {
    id: "social_preferences",
    field: "social_preferences",
    kind: "multi",
    title: "¿Cómo te gustaría utilizar One More Step?",
    subtitle: "Puedes elegir varias.",
    options: socialOptions,
  },
  {
    id: "communities",
    field: "community_ids",
    kind: "communities",
    title: "¿Qué temas te interesan?",
    subtitle: "Te uniremos a estas comunidades. Puedes cambiarlas cuando quieras.",
  },
  {
    id: "privacy",
    field: "privacy_level",
    kind: "privacy",
    title: "¿Qué quieres mostrar públicamente?",
    subtitle: "Nunca mostramos tu email. Puedes cambiarlo más tarde.",
    options: privacyOptions,
  },
  {
    id: "first_step",
    field: "first_step",
    kind: "text",
    title: "¿Cuál es el primer paso que quieres dar?",
    subtitle: "Algo pequeño y concreto. Ese es tu One More Step.",
    placeholder: "Ej.: Entrenar 3 veces esta semana",
  },
];
