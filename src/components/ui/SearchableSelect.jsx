"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function SearchableSelect({ options, placeholder = "Select...", selected, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef();
    const searchInputRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative" ref={containerRef}>
            {/* Select Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-row justify-between items-center w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground md:text-sm"
            >
                <span className={selected ? "text-gray-900" : "text-gray-400"}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                    {/* Search Input */}
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-3 py-2 text-sm placeholder-gray-400 border-b border-gray-200 focus:outline-none focus:ring-0"
                    />

                    {/* Options */}
                    <div className="max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                    className={`flex justify-between items-center px-3 py-2 text-sm cursor-pointer rounded-md ${selected?.value === option.value
                                            ? "bg-blue-50 text-blue-600"
                                            : "hover:bg-gray-100"
                                        }`}
                                >
                                    {option.label}
                                    {selected?.value === option.value && <Check className="w-4 h-4" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
