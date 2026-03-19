// src/components/ui/Input.tsx
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, prefix, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>}
        <div className="relative flex">
          {prefix && (
            <span className="inline-flex items-center px-3 border border-r-0 border-neutral-300 rounded-l-lg bg-neutral-50 text-neutral-600 text-sm">{prefix}</span>
          )}
          <input ref={ref} id={id}
            className={cn(
              "w-full px-3 py-2.5 text-sm border border-neutral-300 bg-white placeholder-neutral-400 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
              "disabled:bg-neutral-50 disabled:text-neutral-400",
              prefix ? "rounded-r-lg" : "rounded-lg",
              error && "border-red-400 focus:ring-red-400",
              className
            )} {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
