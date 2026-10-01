import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 text-base text-ink-900 placeholder:text-ink-400 " +
  "transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(field, "h-14", className)} {...props} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(field, "min-h-32 resize-none py-3.5", className)} {...props} />;
  },
);

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-2 block text-sm font-semibold text-ink-700", className)} {...props} />;
}
