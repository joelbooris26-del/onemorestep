import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { signOut } from "@/features/auth/actions";
import { routes } from "@/config/site";
import { BottomNav, SidebarNav } from "./nav-links";

type ShellUser = { displayName: string; username: string; avatarUrl: string | null };

/**
 * Estructura de la app autenticada.
 *  - Móvil: barra superior + navegación inferior (zona del pulgar).
 *  - Escritorio (lg+): sidebar fija a la izquierda y contenido centrado.
 */
export function AppShell({ user, children }: { user: ShellUser; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar escritorio */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-ink-200/70 bg-white px-4 py-6 lg:flex">
        <Logo href={routes.home} className="px-2" />
        <SidebarNav />
        <div className="mt-auto space-y-2">
          <Link
            href={routes.profile}
            className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-ink-100"
          >
            <Avatar src={user.avatarUrl} name={user.displayName} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{user.displayName}</span>
              <span className="block truncate text-xs text-ink-500">@{user.username}</span>
            </span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
            >
              <LogOut className="size-4" /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Barra superior móvil */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-200/70 bg-ink-50/90 px-4 backdrop-blur-md lg:hidden">
          <Logo href={routes.home} />
          <Link href={routes.profile} aria-label="Mi perfil">
            <Avatar src={user.avatarUrl} name={user.displayName} size="sm" />
          </Link>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-12 lg:pt-10">{children}</main>
      </div>

      <BottomNav />
    </div>
  );
}
