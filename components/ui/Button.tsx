"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
  isExternal?: boolean;
}

const variantStyles = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 border-transparent focus-visible:ring-neutral-900/70",
  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border-transparent focus-visible:ring-neutral-900/70",
  outline:
    "bg-transparent text-neutral-900 hover:bg-neutral-100 border-neutral-200 focus-visible:ring-neutral-900/70",
  ghost:
    "bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border-transparent focus-visible:ring-neutral-900/70",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      href,
      leftIcon,
      rightIcon,
      isFullWidth,
      isExternal = false,
      ...rest
    },
    ref,
  ) => {
    const baseStyles = [
      "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200",
      "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
      "disabled:opacity-50 disabled:pointer-events-none",
      variantStyles[variant],
      sizeStyles[size],
      isFullWidth ? "w-full" : "",
      className,
    ].join(" ");

    if (href) {
      return (
        <Link
          href={href}
          className={baseStyles}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </Link>
      );
    }

    return (
      <button ref={ref} className={baseStyles} {...rest}>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
