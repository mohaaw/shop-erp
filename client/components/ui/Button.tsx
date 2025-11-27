'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-theme focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-100',
      outline: 'border border-secondary-300 bg-transparent text-secondary-900 hover:bg-secondary-50 focus:ring-primary-500 dark:border-secondary-600 dark:text-secondary-100 dark:hover:bg-secondary-900',
      ghost: 'bg-transparent text-secondary-900 hover:bg-secondary-50 focus:ring-primary-500 dark:text-secondary-100 dark:hover:bg-secondary-900',
      danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
      success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-md',
      lg: 'px-6 py-3 text-lg',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
