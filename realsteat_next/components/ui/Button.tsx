import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold uppercase tracking-widest transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-primary text-black hover:bg-white": variant === "primary",
                        "bg-secondary text-secondary-foreground hover:bg-white hover:text-black": variant === "secondary",
                        "border border-primary text-primary hover:bg-primary hover:text-black": variant === "outline",
                        "hover:bg-white/10 text-primary": variant === "ghost",
                        "h-9 px-4 py-2 text-xs": size === "sm",
                        "h-12 px-8 py-3": size === "md",
                        "h-14 px-10 py-4 text-base": size === "lg",
                        "h-12 w-12": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
