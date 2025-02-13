"use client";

import { useState } from "react";
import { useUser } from "@/app/context/UserContext";

const UploadAvatar = () => {
    const { user, login } = useUser();
    const [preview, setPreview] = useState(user?.avatar || "/defaultAvatar.png");

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
            login({ ...user, avatar: url });

            // Enregistrer l'avatar dans la DB (si nécessaire)
            await fetch(`/api/users/${user._id}/avatar`, {
                method: "PUT",
                body: JSON.stringify({ avatar: url }),
                headers: { "Content-Type": "application/json" },
            });
        }
    };

    return (
        <div className="upload-avatar">
            <img src={preview} alt="Avatar" className="avatar" />
            <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
    );
};

export default UploadAvatar;
