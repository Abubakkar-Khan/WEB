import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import './Card.css';

interface CardProps extends React.ComponentProps<typeof motion.div> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -2, borderColor: 'var(--nothing-text)' } : undefined}
        className={cn('nothing-card', hoverable && 'hoverable', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('nothing-card-header', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('nothing-card-title', className)} {...props}>
    {children}
  </h3>
);

export const CardBody = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('nothing-card-body', className)} {...props}>
    {children}
  </div>
);
