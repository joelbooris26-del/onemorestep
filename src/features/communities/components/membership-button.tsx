"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { joinCommunity, leaveCommunity } from "../actions";

export function MembershipButton({
  communityId,
  isMember,
  size = "sm",
  className,
}: {
  communityId: string;
  isMember: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const [optimisticMember, setOptimisticMember] = useOptimistic(isMember);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    const next = !optimisticMember;
    startTransition(async () => {
      setOptimisticMember(next);
      const result = next ? await joinCommunity(communityId) : await leaveCommunity(communityId);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className={cn("flex flex-col items-end", className)}>
      <Button
        onClick={toggle}
        disabled={pending}
        size={size}
        variant={optimisticMember ? "outline" : "secondary"}
        aria-pressed={optimisticMember}
        className="group min-w-24"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : optimisticMember ? (
          <>
            <Check className="size-4 group-hover:hidden" />
            <span className="group-hover:hidden">Miembro</span>
            <span className="hidden group-hover:inline">Salir</span>
          </>
        ) : (
          <>
            <Plus className="size-4" /> Unirme
          </>
        )}
      </Button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
