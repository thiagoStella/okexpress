import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, ...props }) {
    return (
        <div
            className={twMerge(clsx('bg-brand-secondary rounded-lg p-4 shadow-md', className))}
            {...props}
        >
            {children}
        </div>
    );
}
