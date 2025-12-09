import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({
    label,
    error,
    className,
    id,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={id}
                className={twMerge(clsx(
                    'w-full px-3 py-2 bg-brand-secondary border border-gray-700 rounded text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                ))}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
