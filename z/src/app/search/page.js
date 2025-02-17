"use client";

import { useState } from "react";
import Link from "next/link";
import { URL } from '../utils/constant/utls';
import withAuth from "../components/withAuth";
import SearchBar from "../components/searchBar";
import SearchResponse from "../components/searchResponse";

const Search = () => {
    const [searchResults, setSearchResults] = useState({ users: [], tweets: [] });
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults({ users: [], tweets: [] });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Erreur de recherche:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <SearchBar onSearch={handleSearch} />
            {loading ? (
                <div className="text-center mt-4">
                    <p className="text-white">Chargement...</p>
                </div>
            ) : (
                <SearchResponse
                    users={searchResults.users}
                    tweets={searchResults.tweets}
                />
            )}
        </div>
    );
}

export default withAuth(Search);