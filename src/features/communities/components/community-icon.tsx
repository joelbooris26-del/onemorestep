import { cn } from "@/lib/utils";

const sizes = { sm: "size-10 text-lg rounded-xl", md: "size-12 text-2xl rounded-2xl", lg: "size-16 text-3xl rounded-2xl sm:size-20 sm:text-4xl" };

export function CommunityIcon({
  icon,
  color,
  size = "md",
  className,
}: {
  icon: string;
  color: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center", sizes[size], className)}
      style={{ backgroundColor: `${color}1f` }}
    >
      {icon}
    </span>
  );
}
