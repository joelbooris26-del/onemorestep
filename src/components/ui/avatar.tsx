import { cn } from "@/lib/utils";

const sizes = { sm: "size-9 text-sm", md: "size-12 text-base", lg: "size-20 text-2xl sm:size-24" };

export function Avatar({
  src,
  name,
  size = "md",
  className,
}: {
  src: string | null | undefined;
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "·";
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-bold text-brand-800 ring-2 ring-white",
        sizes[size],
        className,
      )}
    >
      {src ? (
        // Las fotos de Google vienen de lh3.googleusercontent.com; <img> evita configurar dominios.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} referrerPolicy="no-referrer" className="size-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
