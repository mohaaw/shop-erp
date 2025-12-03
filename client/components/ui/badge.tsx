'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'secondary';
  size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full whitespace-nowrap';

    const variantStyles = {
      default: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100',
      success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-100',
      warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-100',
      error: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-100',
      info: 'bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-100',
      outline: 'border-2 border-primary-500 text-primary-700 dark:border-primary-400 dark:text-primary-300',
      secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-100',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
