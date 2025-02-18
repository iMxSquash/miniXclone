"use client";

import { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";

const UploadAvatar = () => {
    const { user, login } = useUser();
    const [preview, setPreview] = useState(user?.avatar || "/uploads/defaultAvatar.png");

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const { url } = await res.json();
            setPreview(url);

            // mettre à jour l'utilisateur dans le contexte
            if (user) {
                login({ ...user, avatar: url });

                // enregistrer l'avatar dans la DB 
                await fetch(`/api/user/${user._id}`, {
                    method: "PUT",
                    body: JSON.stringify({ avatar: url }),
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
    };

    return (
        <div className="relative w-24 h-24 -mb-12 ml-6">
            <Image
                src={preview}
                alt="Avatar"
                width={96}
                height={96}
                className="w-full h-full rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity border-4 border-background"
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
        </div>
    );
};

export default UploadAvatar;
