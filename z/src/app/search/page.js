"use client";

import { useState } from "react";
import withAuth from "../components/hook/withAuth";
import SearchBar from "../components/container/searchBar";
import SearchResponse from "../components/tweet/searchResponse";
import Loading from "../loading";

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
        <div className="mx-auto px-4 py-2 h-[100dvh] overflow-y-auto border-r border-border-dark">
            <SearchBar onSearch={handleSearch} />
            {loading ? (
                <div className="text-center mt-4">
                    <Loading />
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