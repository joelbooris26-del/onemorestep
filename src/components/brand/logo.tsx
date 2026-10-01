import Link from "next/link";
import { cn } from "@/lib/utils";

/** Isotipo: tres escalones ascendentes; el último es "el siguiente paso". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)}>
      <rect width="32" height="32" rx="9" className="fill-ink-900" />
      <rect x="7" y="18" width="5" height="7" rx="1.5" className="fill-ink-500" />
      <rect x="13.5" y="13" width="5" height="12" rx="1.5" className="fill-ink-300" />
      <rect x="20" y="7" width="5" height="18" rx="1.5" className="fill-brand-400" />
    </svg>
  );
}

export function Logo({
  href = "/",
  className,
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 font-bold tracking-tight", className)}
      aria-label="One More Step"
    >
      <LogoMark />
      {!compact && <span className="text-[1.05rem]">One More Step</span>}
    </Link>
  );
}
