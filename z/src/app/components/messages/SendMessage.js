"use client";

import { useState, useRef } from "react";
import { useUser } from "../../context/UserContext";
import useSocket from "../hook/useSocket";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

export default function SendMessage({ conversationId }) {
    const { user } = useUser();
    const socket = useSocket();
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content && images.length === 0) return;

        setLoading(true);
        try {
            const mediaUrls = [];
            for (const image of images) {
                const formData = new FormData();
                formData.append("file", image);
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });
                if (res.ok) {
                    const { url } = await res.json();
                    mediaUrls.push(url);
                }
            }

            const messageData = {
                conversationId,
                content,
                sender: user._id,
                mediaFiles: mediaUrls
            };

            const res = await fetch("/api/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messageData)
            });

            if (res.ok && socket) {
                const newMessage = await res.json();
                socket.emit("newMessage", newMessage);
                setContent("");
                setImages([]);
                setPreviews([]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="flex flex-col gap-2">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="w-full p-2 bg-background border border-border-dark rounded-lg resize-none"
                    rows={3}
                />

                {previews.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImages(images.filter((_, i) => i !== index));
                                        setPreviews(previews.filter((_, i) => i !== index));
                                    }}
                                    className="absolute -top-2 -right-2 bg-background rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <label className="cursor-pointer">
                        <ImageIcon className="text-primary" />
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setImages(prev => [...prev, ...files]);
                                setPreviews(prev => [
                                    ...prev,
                                    ...files.map(file => URL.createObjectURL(file))
                                ]);
                            }}
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading || (!content && images.length === 0)}
                        className="bg-primary text-white px-4 py-2 rounded-full disabled:opacity-50"
                    >
                        Envoyer
                    </button>
                </div>
            </div>
        </form>
    );
}
