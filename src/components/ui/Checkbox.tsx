"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="flex cursor-pointer items-start gap-3 text-sm text-foreground/70"
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={`mt-0.5 h-5 w-5 shrink-0 rounded-md border border-foreground/20 accent-foreground ${className}`}
            {...props}
          />
          <span>{label}</span>
        </label>
        {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
