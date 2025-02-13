"use client";

import Link from "next/link";
import { useUser } from "@/app/context/UserContext";

const ProfilUser = ({ userGeted }) => {
    const { user } = useUser();

    if (!user || !userGeted?.user) return null;

    return user._id === userGeted.user._id ? (
        <div className="flex flex-col gap-2 px-4">
            <div className="font-bold text-2xl">
                {user.name}
            </div>
        </div>
    ) : (
        <>
            {
                userGeted.user &&
                Object.entries(userGeted.user).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-2">
                        <strong>{key}:</strong> {typeof value === "object" ? JSON.stringify(value) : value}
                    </div>
                ))
            }
        </>
    );
};

export default ProfilUser;
