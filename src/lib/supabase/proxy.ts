import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { protectedPrefixes, routes } from "@/config/site";
import type { Database } from "@/types/database";

/**
 * Refresca la sesión de Supabase en cada petición y protege las rutas privadas.
 * El control de "onboarding completado" se hace en los layouts (necesita BD).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(env.supabaseUrl, env.supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // No pongas código entre createServerClient y getClaims(): getClaims valida
  // el JWT y refresca el token si ha caducado.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims?.sub);

  const { pathname, search } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isLoggedIn && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = routes.login;
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return redirectWithCookies(url, response);
  }

  if (isLoggedIn && pathname === routes.login) {
    const url = request.nextUrl.clone();
    url.pathname = routes.home;
    url.search = "";
    return redirectWithCookies(url, response);
  }

  return response;
}

function redirectWithCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
