import React from 'react';
import { cn } from '../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
  size?: 'sm' | 'md';
}

export default function Badge({
  children,
  variant = 'primary',
  className,
  size = 'md',
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200 dark:border-primary-800',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    info: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded font-medium',
    md: 'text-xs sm:text-sm px-2.5 py-1 rounded-md font-medium',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 font-semibold uppercase tracking-wider', variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
}
