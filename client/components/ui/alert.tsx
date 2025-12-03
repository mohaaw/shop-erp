'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', dismissible = false, onDismiss, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    if (!isVisible) return null;

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    const baseStyles = 'relative w-full rounded-lg border p-4 flex items-start gap-3';

    const variantStyles = {
      default: 'border-primary-200 bg-primary-50 text-primary-900 dark:border-primary-900 dark:bg-primary-900/20 dark:text-primary-100',
      success: 'border-success-200 bg-success-50 text-success-900 dark:border-success-900 dark:bg-success-900/20 dark:text-success-100',
      warning: 'border-warning-200 bg-warning-50 text-warning-900 dark:border-warning-900 dark:bg-warning-900/20 dark:text-warning-100',
      error: 'border-error-200 bg-error-50 text-error-900 dark:border-error-900 dark:bg-error-900/20 dark:text-error-100',
      info: 'border-info-200 bg-info-50 text-info-900 dark:border-info-900 dark:bg-info-900/20 dark:text-info-100',
    };

    const iconColor = {
      default: 'text-primary-600 dark:text-primary-400',
      success: 'text-success-600 dark:text-success-400',
      warning: 'text-warning-600 dark:text-warning-400',
      error: 'text-error-600 dark:text-error-400',
      info: 'text-info-600 dark:text-info-400',
    };

    const IconComponent = {
      default: AlertCircle,
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertCircle,
      info: Info,
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        <IconComponent className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColor[variant])} />
        <div className="flex-1">{children}</div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-theme"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
