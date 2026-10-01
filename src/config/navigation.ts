import { Compass, Home, User, type LucideIcon } from "lucide-react";
import { routes } from "./site";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Prefijo de ruta que marca el elemento como activo. */
  match: string;
};

/**
 * Navegación principal (sidebar en escritorio, barra inferior en móvil).
 * Futuras secciones (Explorar, Notificaciones, Mensajes…) se añaden aquí.
 */
export const mainNav: NavItem[] = [
  { label: "Inicio", href: routes.home, icon: Home, match: "/home" },
  { label: "Comunidades", href: routes.communities, icon: Compass, match: "/communities" },
  { label: "Perfil", href: routes.profile, icon: User, match: "/profile" },
];
