export const siteConfig = {
  name: "One More Step",
  shortName: "OMS",
  tagline: "Cada objetivo empieza con un paso.",
  description:
    "Crea objetivos, sigue tu progreso y únete a comunidades de personas que, como tú, están dando un paso más cada día.",
} as const;

/** Rutas centralizadas: un cambio de URL se hace en un solo sitio. */
export const routes = {
  landing: "/",
  login: "/login",
  authCallback: "/auth/callback",
  onboarding: "/onboarding",
  welcome: "/welcome",
  home: "/home",
  communities: "/communities",
  discover: "/communities?tab=discover",
  community: (slug: string) => `/communities/${slug}`,
  profile: "/profile",
  profileEdit: "/profile/edit",
  user: (username: string) => `/u/${username}`,
} as const;

/** Rutas que requieren sesión iniciada (las comprueba src/proxy.ts). */
export const protectedPrefixes = [
  "/home",
  "/communities",
  "/profile",
  "/u/",
  "/onboarding",
  "/welcome",
];
