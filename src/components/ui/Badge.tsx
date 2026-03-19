// src/components/ui/Badge.tsx
import { cn } from "@/lib/utils";

type BadgeVariant = "green" | "blue" | "amber" | "red" | "gray" | "purple";

const variants: Record<BadgeVariant, string> = {
  green:  "bg-green-100 text-green-800",
  blue:   "bg-blue-100 text-blue-800",
  amber:  "bg-amber-100 text-amber-800",
  red:    "bg-red-100 text-red-800",
  gray:   "bg-neutral-100 text-neutral-700",
  purple: "bg-purple-100 text-purple-800",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "gray", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
