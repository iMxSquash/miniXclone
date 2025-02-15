"use client";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import useSocket from "./useSocket";

export default function AddTweet() {
    const { user } = useUser();
    const socket = useSocket();
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) {
            setMessage("Veuillez remplir tous les champs !");
            return;
        }

        setLoading(true);
        try {
            // Upload des images
            const mediaUrls = [];
            for (const image of images) {
                const formData = new FormData();
                formData.append("file", image);
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (res.ok) {
                    const { url } = await res.json();
                    mediaUrls.push(url);
                }
            }

            // Créer le tweet
            const formData = new FormData();
            formData.append("userId", user._id);
            formData.append("content", content);
            formData.append("mediaFiles", JSON.stringify(mediaUrls));

            const res = await fetch("/api/tweet", { method: "POST", body: formData });
            const data = await res.json();

            if (res.ok && socket) {
                // Émettre le tweet comme dans messages/page.js
                const tweetToEmit = {
                    ...data.tweet,
                    author: {
                        _id: user._id,
                        name: user.name,
                        avatar: user.avatar
                    }
                };
                socket.emit("newTweet", tweetToEmit);

                setContent("");
                setImages([]);
                setPreviews([]);
            }
        } catch (error) {
            setMessage("Une erreur est survenue.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Ajouter un tweet</h2>
            {message && <p className="text-red-500">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    placeholder="Contenu du tweet"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="4"
                />
                <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                {previews.map((preview, index) => (
                    <img key={index} src={preview} alt="Preview" className="w-full h-40 object-cover rounded mt-2" />
                ))}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    {loading ? "Ajout en cours..." : "Tweet ajouté"}
                </button>
            </form>
        </div>
    );
}
