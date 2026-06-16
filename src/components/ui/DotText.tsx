import React from 'react';
import { cn } from '../../lib/utils';

interface DotTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'div';
}

export const DotText: React.FC<DotTextProps> = ({ 
  className, 
  as: Component = 'span', 
  children, 
  ...props 
}) => {
  return (
    <Component className={cn('dot-text', className)} {...props}>
      {children}
    </Component>
  );
};
