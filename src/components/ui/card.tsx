import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[var(--radius-card)] border border-ink-200/80 bg-white p-5 sm:p-6", className)}
      {...props}
    />
  );
}

export function SectionTitle({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-4", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">{title}</h2>
      {action}
    </div>
  );
}
