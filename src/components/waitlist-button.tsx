// src/components/waitlist-button.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { WaitlistModal } from "./waitlist-modal";
import { Heart } from "lucide-react";

export function WaitlistButton({
  variant = "default",
  size = "default",
  className = "",
  children,
}: {
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <WaitlistModal>
      <Button variant={variant} size={size} className={className}>
        {children ?? <><Heart className="mr-2 h-4 w-4"/>Join Waitlist</>}
      </Button>
    </WaitlistModal>
  );
}
