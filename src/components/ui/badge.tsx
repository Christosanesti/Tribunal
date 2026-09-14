import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const Badge = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    variant?: "default" | "secondary" | "outline" | "destructive";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm",
    secondary: "inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground shadow-sm",
    outline: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm",
    destructive: "inline-flex items-center rounded-full bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground shadow-sm",
  };

  return (
    <div
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
