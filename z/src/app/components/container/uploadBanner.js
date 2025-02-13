"use client";

import { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";

const UploadBanner = () => {
    const { user, login } = useUser();
    const [preview, setPreview] = useState(user?.banner || "/uploads/defaultBanner.png");

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

            // Mettre à jour l'utilisateur dans le contexte
            if (user) {
                login({ ...user, banner: url });

                // Enregistrer la banner dans la DB 
                await fetch(`/api/user/${user._id}`, {
                    method: "PUT",
                    body: JSON.stringify({ banner: url }),
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
    };

    return (
        <div className="relative w-full max-h-96 cover -mb-12">
            <img
                src={preview}
                alt="Banner"
                className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
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

export default UploadBanner;
