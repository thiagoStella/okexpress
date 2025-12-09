import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-brand-red text-white hover:bg-red-700',
        secondary: 'bg-brand-secondary text-text-primary hover:bg-gray-700',
        outline: 'border border-gray-600 text-text-primary hover:bg-brand-secondary',
        ghost: 'text-text-primary hover:bg-brand-secondary',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg', // Larger touch target
        icon: 'p-2',
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            {...props}
        >
            {children}
        </button>
    );
}
