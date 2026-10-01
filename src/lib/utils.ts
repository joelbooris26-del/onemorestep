import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const memberFormatter = new Intl.NumberFormat("es-ES", { notation: "compact" });

export function formatMembers(count: number) {
  return `${memberFormatter.format(count)} ${count === 1 ? "miembro" : "miembros"}`;
}

export function formatJoinedDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(new Date(iso));
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

/** Evita open-redirects: solo se aceptan rutas internas. */
export function safeRedirectPath(path: string | null | undefined, fallback = "/home") {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return fallback;
  }
  return path;
}
