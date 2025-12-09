import React, { useState, useEffect, useRef } from 'react';
import { useAddressSearch } from '../../hooks/useAddressSearch';
import { Input } from '../ui/Input';
import { clsx } from 'clsx';

export function AddressAutocomplete({ value, onChange, label, placeholder, error }) {
    const { results, search } = useAddressSearch();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
        search(newValue);
        setIsOpen(true);
    };

    const handleSelect = (address) => {
        onChange(address);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <Input
                label={label}
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                error={error}
                autoComplete="off"
            />

            {isOpen && results.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-brand-secondary border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    {results.map((address, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-text-primary"
                            onClick={() => handleSelect(address)}
                        >
                            {address}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
