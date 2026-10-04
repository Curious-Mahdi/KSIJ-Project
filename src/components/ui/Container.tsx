import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({
  children,
  className = '',
  as: Component = 'div',
  ...props
}: ContainerProps) {
  const Comp = Component as any;
  return (
    <Comp
      className={`w-full max-w-[1240px] mx-auto px-5 sm:px-8 ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
