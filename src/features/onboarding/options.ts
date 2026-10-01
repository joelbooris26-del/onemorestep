/**
 * Opciones del onboarding. El `value` se guarda en BD (estable, en inglés);
 * el `label` es lo que ve el usuario. Para cambiar textos, edita solo `label`.
 * Si cambias valores o preguntas, sube ONBOARDING_VERSION.
 */

export const ONBOARDING_VERSION = 1;

export type Option<V extends string = string> = {
  value: V;
  label: string;
  emoji?: string;
  description?: string;
};

export const occupationOptions = [
  { value: "student", label: "Estudio", emoji: "🎓" },
  { value: "employed", label: "Trabajo", emoji: "💼" },
  { value: "entrepreneur", label: "Emprendimiento", emoji: "🚀" },
  { value: "work_and_study", label: "Trabajo y estudio", emoji: "⚖️" },
  { value: "job_seeking", label: "Buscando trabajo", emoji: "🔎" },
  { value: "building_project", label: "Estoy creando mi propio proyecto", emoji: "🛠️" },
  { value: "other", label: "Otro", emoji: "✏️" },
] as const satisfies readonly Option[];

export const lifeGoalOptions = [
  { value: "start_business", label: "Empezar un negocio", emoji: "🚀" },
  { value: "grow_business", label: "Hacer crecer mi negocio", emoji: "📈" },
  { value: "make_money", label: "Ganar dinero", emoji: "💰" },
  { value: "learn_skill", label: "Aprender una habilidad", emoji: "🧠" },
  { value: "start_exercising", label: "Empezar a hacer ejercicio", emoji: "🏃" },
  { value: "improve_physique", label: "Mejorar mi físico", emoji: "💪" },
  { value: "eat_better", label: "Mejorar mi alimentación", emoji: "🥗" },
  { value: "lose_weight", label: "Perder peso", emoji: "⚖️" },
  { value: "gain_strength", label: "Ganar fuerza", emoji: "🏋️" },
  { value: "study", label: "Estudiar", emoji: "📚" },
  { value: "be_productive", label: "Ser más productivo", emoji: "⏱️" },
  { value: "build_projects", label: "Crear proyectos", emoji: "🛠️" },
  { value: "improve_habits", label: "Mejorar mis hábitos", emoji: "🔁" },
  { value: "meet_people", label: "Conocer gente con objetivos similares", emoji: "🤝" },
  { value: "personal_growth", label: "Mejorar personalmente", emoji: "🌱" },
  { value: "other", label: "Otro", emoji: "✏️" },
] as const satisfies readonly Option[];

export const stageOptions = [
  { value: "not_started", label: "Todavía no he empezado", emoji: "🌑" },
  { value: "starting", label: "Estoy empezando", emoji: "🌒" },
  { value: "weeks", label: "Llevo unas semanas", emoji: "🌓" },
  { value: "months", label: "Llevo varios meses", emoji: "🌔" },
  { value: "years", label: "Llevo años trabajando en ello", emoji: "🌕" },
] as const satisfies readonly Option[];

export const dailyTimeOptions = [
  { value: "lt_30m", label: "Menos de 30 minutos" },
  { value: "30_60m", label: "30-60 minutos" },
  { value: "1_2h", label: "1-2 horas" },
  { value: "2_4h", label: "2-4 horas" },
  { value: "gt_4h", label: "Más de 4 horas" },
  { value: "varies", label: "Depende del día" },
] as const satisfies readonly Option[];

export const socialOptions = [
  { value: "share_progress", label: "Quiero compartir mi progreso", emoji: "📣" },
  { value: "meet_similar", label: "Quiero conocer personas con objetivos similares", emoji: "🤝" },
  { value: "learn_from_others", label: "Quiero aprender de otras personas", emoji: "🧠" },
  { value: "get_motivation", label: "Quiero recibir motivación", emoji: "🔥" },
  { value: "find_mentors", label: "Quiero encontrar personas más avanzadas que yo", emoji: "🧭" },
  { value: "help_others", label: "Quiero ayudar a otras personas", emoji: "🙌" },
  { value: "private", label: "Prefiero trabajar de forma privada", emoji: "🔒" },
] as const satisfies readonly Option[];

export const privacyOptions = [
  {
    value: "public",
    label: "Quiero tener un perfil público",
    emoji: "🌍",
    description: "Otros miembros verán tu perfil, objetivos, comunidades, edad y ocupación.",
  },
  {
    value: "limited",
    label: "Mostrar mi progreso, pero mantener algunos datos privados",
    emoji: "🌗",
    description: "Se ven tus objetivos y comunidades. Tu edad y ocupación quedan ocultas.",
  },
  {
    value: "private",
    label: "Prefiero mantener mi perfil lo más privado posible",
    emoji: "🔒",
    description: "Solo se ven tu nombre y tu foto. Todo lo demás es solo para ti.",
  },
] as const satisfies readonly Option[];

type Values<T extends readonly Option[]> = T[number]["value"];
export type OccupationValue = Values<typeof occupationOptions>;
export type LifeGoalValue = Values<typeof lifeGoalOptions>;
export type StageValue = Values<typeof stageOptions>;
export type DailyTimeValue = Values<typeof dailyTimeOptions>;
export type SocialValue = Values<typeof socialOptions>;
export type PrivacyValue = Values<typeof privacyOptions>;

export function labelFor(options: readonly Option[], value: string | null | undefined) {
  return options.find((o) => o.value === value)?.label ?? null;
}

export const valuesOf = <T extends readonly Option[]>(options: T) =>
  options.map((o) => o.value) as unknown as [Values<T>, ...Values<T>[]];
