import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'right',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#098231] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-[13px] px-3.5 py-1.5 rounded-[8px] gap-1.5',
    md: 'text-[15px] px-5 py-2.5 rounded-[10px] gap-2',
    lg: 'text-[16px] px-6 py-3 rounded-[10px] gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#098231] text-white hover:bg-[#076b28] active:bg-[#06541f] border border-[#098231]',
    secondary: 'bg-white text-[#09231F] border border-[#09231F]/15 hover:border-[#098231] hover:text-[#098231] active:bg-[#f0f8f3]',
    outline: 'bg-transparent text-[#098231] border border-[#098231] hover:bg-[#098231]/10 active:bg-[#098231]/15',
    dark: 'bg-[#09231F] text-white hover:bg-[#123630] border border-[#09231F]',
    ghost: 'bg-transparent text-[#09231F] hover:bg-[#09231F]/5',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
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
