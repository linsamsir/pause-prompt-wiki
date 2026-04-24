import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 text-xs font-medium tracking-wider uppercase",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground",
        outline: "border-foreground text-foreground",
        secondary:
          "border-border bg-secondary text-secondary-foreground",
        muted: "border-border bg-muted text-muted-foreground",
        nsfw:
          "border-primary text-primary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
