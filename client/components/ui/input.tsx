'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1.5">
            {label}
            {required && <span className="text-error-600">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border rounded-md text-sm transition-theme',
            'border-secondary-300 bg-white text-secondary-900 placeholder-secondary-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'dark:border-secondary-600 dark:bg-secondary-800 dark:text-white dark:placeholder-secondary-400',
            'disabled:bg-secondary-100 disabled:text-secondary-500 disabled:cursor-not-allowed',
            'dark:disabled:bg-secondary-900',
            error && 'border-error-500 focus:ring-error-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-error-600 text-sm mt-1">{error}</p>}
        {hint && <p className="text-secondary-600 dark:text-secondary-400 text-sm mt-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
