"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={`resize-none rounded-xl border bg-white/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all duration-300 focus:bg-white focus:shadow-sm ${
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

Textarea.displayName = "Textarea";
export default Textarea;
