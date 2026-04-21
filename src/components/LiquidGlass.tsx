import type { ElementType, ReactNode } from 'react';

type LiquidGlassProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

export function LiquidGlass<T extends ElementType = 'div'>({
  as,
  className = '',
  children,
  ...rest
}: LiquidGlassProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag className={`liquid-glass ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
