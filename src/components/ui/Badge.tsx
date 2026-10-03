import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'green' | 'dark' | 'neutral' | 'outline';
  className?: string;
}

export function Badge({
  children,
  variant = 'green',
  className = '',
  ...props
}: BadgeProps) {
  const variantStyles = {
    green: 'bg-[#098231]/10 text-[#098231] border border-[#098231]/20',
    dark: 'bg-[#09231F] text-white border border-[#09231F]',
    neutral: 'bg-[#09231F]/5 text-[#09231F] border border-[#09231F]/10',
    outline: 'bg-transparent text-[#098231] border border-[#098231]',
  };

  return (
    <span
      className={`inline-flex items-center text-[12px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-[6px] ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
