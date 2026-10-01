"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="mt-8 flex flex-col gap-1">
      {mainNav.map(({ label, href, icon: Icon, match }) => {
        const active = pathname.startsWith(match);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-colors",
              active ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-200/70 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-3">
        {mainNav.map(({ label, href, icon: Icon, match }) => {
          const active = pathname.startsWith(match);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  active ? "text-ink-900" : "text-ink-400",
                )}
              >
                <Icon className={cn("size-6 transition-transform", active && "scale-110")} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
