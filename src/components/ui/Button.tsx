import React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#098231] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#098231] text-white hover:bg-[#076b28] active:bg-[#06541f] border border-[#098231]",
        primary: "bg-[#098231] text-white hover:bg-[#076b28] active:bg-[#06541f] border border-[#098231]",
        secondary: "bg-white text-[#09231F] border border-[#09231F]/15 hover:border-[#098231] hover:text-[#098231] active:bg-[#f0f8f3]",
        outline: "bg-transparent text-[#098231] border border-[#098231] hover:bg-[#098231]/10 active:bg-[#098231]/15",
        dark: "bg-[#09231F] text-white hover:bg-[#123630] border border-[#09231F]",
        ghost: "bg-transparent text-[#09231F] hover:bg-[#09231F]/5",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20",
        link: "text-[#098231] underline-offset-4 hover:underline",
      },
      size: {
        default: "text-[15px] px-5 py-2.5 rounded-[10px] gap-2",
        md: "text-[15px] px-5 py-2.5 rounded-[10px] gap-2",
        sm: "text-[13px] px-3.5 py-1.5 rounded-[8px] gap-1.5",
        lg: "text-[16px] px-6 py-3 rounded-[10px] gap-2.5",
        xs: "h-6 gap-1 px-2 text-xs rounded-md",
        icon: "size-8 rounded-lg",
        "icon-xs": "size-6 rounded-md",
        "icon-sm": "size-7 rounded-md",
        "icon-lg": "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'default',
  href,
  icon,
  iconPosition = 'right',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const combinedClasses = cn(buttonVariants({ variant, size }), className);

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses} {...(props as any)}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {content}
    </button>
  );
}

export { buttonVariants };
