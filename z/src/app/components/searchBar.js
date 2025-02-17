"use client";
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearch = useCallback(
        debounce((query) => {
            onSearch(query);
        }, 300),
        []
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Rechercher des utilisateurs ou des tweets..."
                className="w-full p-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-primary"
            />
        </div>
    );
};

export default SearchBar;
