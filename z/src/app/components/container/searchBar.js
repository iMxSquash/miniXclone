"use client";
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';

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
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Search"
                    className="w-full p-3 pl-10 rounded-full text-secondary-light border-2 border-border-dark focus:outline-none focus:border-primary bg-transparent caret-primary"
                />
            </div>
        </div>
    );
};

export default SearchBar;
