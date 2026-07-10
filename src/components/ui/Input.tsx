"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, optional, className = "", id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-wider text-foreground/50"
        >
          {label}
          {optional && (
            <span className="ml-1 normal-case tracking-normal text-foreground/30">
              (optioneel)
            </span>
          )}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`rounded-xl border bg-white/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all duration-300 focus:bg-white focus:shadow-sm ${
            error
              ? "border-red-300 focus:border-red-400"
              : "border-foreground/10 focus:border-foreground/30"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
