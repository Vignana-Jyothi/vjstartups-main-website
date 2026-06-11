import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-[hsl(var(--vj-accent))] text-[hsl(var(--vj-accent-foreground))]",
        secondary: "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-vj-border",
        destructive: "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-red-600 text-white",
        outline: "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-[hsl(var(--foreground))] border border-vj-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
