"use client";

import { useState, useRef } from "react";
import { useUser } from "../../context/UserContext";
import useSocket from "../hook/useSocket";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

export default function NewConversationModal({ onClose, onConversationCreated }) {
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchUsers = async (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        try {
            const res = await fetch(`/api/user/search?q=${query}`);
            if (res.ok) {
                const users = await res.json();
                setSearchResults(users.filter(u => u._id !== user._id));
            }
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleUserSelect = (selectedUser) => {
        if (!selectedUsers.find(u => u._id === selectedUser._id)) {
            setSelectedUsers([...selectedUsers, selectedUser]);
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleCreateConversation = async () => {
        if (selectedUsers.length === 0) return;

        setLoading(true);
        try {
            const res = await fetch('/api/conversation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participants: [user._id, ...selectedUsers.map(u => u._id)]
                })
            });

            if (res.ok) {
                onConversationCreated();
                onClose();
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-background p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Nouvelle conversation</h2>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchUsers(e.target.value);
                    }}
                    placeholder="Rechercher des utilisateurs..."
                    className="w-full p-2 border border-border-dark rounded-lg mb-4"
                />

                {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedUsers.map(user => (
                            <div key={user._id} className="flex items-center bg-primary text-white px-2 py-1 rounded-full">
                                <span>{user.name}</span>
                                <button
                                    onClick={() => setSelectedUsers(selectedUsers.filter(u => u._id !== user._id))}
                                    className="ml-2"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {searchResults.length > 0 && (
                    <div className="mb-4">
                        {searchResults.map(user => (
                            <div
                                key={user._id}
                                onClick={() => handleUserSelect(user)}
                                className="p-2 hover:bg-hover cursor-pointer rounded"
                            >
                                {user.name}
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={handleCreateConversation}
                    disabled={loading || selectedUsers.length === 0}
                    className="w-full bg-primary text-white py-2 rounded-lg disabled:opacity-50"
                >
                    Créer la conversation
                </button>
            </div>
        </div>
    );
}
