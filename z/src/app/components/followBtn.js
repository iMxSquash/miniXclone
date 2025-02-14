"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";

const FollowButton = ({ userId }) => {
    const { user } = useUser();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setIsFollowing(user.following.includes(userId));
        }
    }, [user]);

    const handleFollow = async () => {
        if (!user) return alert("Connectez-vous pour suivre quelqu'un.");

        setLoading(true);
        console.log(userId);
        console.log(user._id);
        const res = await fetch(`/api/user/${userId}/follow`, {
            method: "PUT",
            body: JSON.stringify({ userId: user._id }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
            setIsFollowing(!isFollowing);
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleFollow}
            className="text-background bg-secondary-light rounded-full px-4 py-2 font-bold"
            disabled={loading}
        >
            {isFollowing ? "Ne plus suivre" : "Suivre"}
        </button>
    );
};

export default FollowButton;
