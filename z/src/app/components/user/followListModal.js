"use client";

import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import Link from "next/link";
import { LucideLink2 } from "lucide-react";

const FollowListModal = ({ userId, type, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/user/${userId}/${type}`);
                const data = await res.json();

                if (res.ok) {
                    let userIds = [];
                    if (type === "followers" && data.followers) {
                        userIds = data.followers;
                    } else if (type === "following" && data.following) {
                        userIds = data.following;
                    }

                    // correction de la gestion des IDs
                    const userDetailsPromises = userIds.map(async (id) => {
                        // extraire l'ID correctement selon le format
                        const userId = id?._id || id?.toString() || id;

                        if (!userId) {
                            console.error("ID invalide:", id);
                            return null;
                        }

                        try {
                            const res = await fetch(`/api/user/${userId}`);
                            if (!res.ok) {
                                console.error(`Erreur pour l'utilisateur ${userId}:`, await res.text());
                                return null;
                            }
                            const userData = await res.json();
                            return userData;
                        } catch (error) {
                            console.error(`Erreur pour l'utilisateur ${userId}:`, error);
                            return null;
                        }
                    });

                    const userDetails = await Promise.all(userDetailsPromises);
                    console.log("Détails des utilisateurs:", userDetails);
                    setUsers(userDetails.filter(user => user !== null));
                } else {
                    console.error("Erreur API :", data);
                    setUsers([]);
                }
            } catch (error) {
                console.error("Erreur fetch :", error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userId, type]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative bg-background text-secondary-light p-5 rounded-lg w-96 h-[80dvh] overflow-auto">
                <h2 className="text-xl font-bold">{type === "followers" ? "Followers" : "Following"}</h2>
                <button onClick={onClose} className="absolute top-2 right-2 text-secondary-light">✖</button>

                {loading ? (
                    <Loading />
                ) : users.length === 0 ? (
                    <p>Pas d'utilisateur trouvé</p>
                ) : (
                    <ul className="mt-3">
                        {users.map((user) => (
                            <li key={`user-${user.user._id}`} className="flex items-center justify-between py-2 border-b border-border-dark">
                                <Link href={`/user/${user.user._id}`} className="flex items-center gap-3 w-full hover:bg-secondary-dark/20 rounded-xl p-2">
                                    <img src={user.user.avatar} alt={user.user.name} className="w-10 h-10 rounded-full" />
                                    <span>{user.user.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FollowListModal;
