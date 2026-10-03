import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'white' | 'dark' | 'muted';
}

export function Section({
  children,
  className = '',
  id,
  variant = 'default',
  ...props
}: SectionProps) {
  const variantStyles = {
    default: 'bg-[#E1DFDA] text-[#09231F]',
    white: 'bg-white text-[#09231F]',
    dark: 'bg-[#09231F] text-white',
    muted: 'bg-[#d8d5cf] text-[#09231F]',
  };

  return (
    <section
      id={id}
      className={`py-14 sm:py-16 md:py-24 lg:py-28 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
