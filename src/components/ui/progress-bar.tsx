import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max = 100,
  className,
  label,
}: {
  value: number;
  max?: number;
  className?: string;
  label?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-ink-200/70", className)}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
