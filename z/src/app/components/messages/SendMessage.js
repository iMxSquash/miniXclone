"use client";

import { useState, useRef, useEffect } from "react";
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
    const textareaRef = useRef(null);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [content]);

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
                socket.emit("newMessage", newMessage);  // e&mission du message via socket
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
        <form onSubmit={handleSubmit} className="p-4 border-t border-border-dark">
            <div className="flex items-start gap-4 w-full">
                <Image src={user.avatar} width={40} height={40} alt={user.name} className="rounded-full" />
                <div className="relative w-full">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => {
                            if (e.target.value.length <= 1000) {
                                setContent(e.target.value);
                            }
                        }}
                        placeholder="Écrivez votre message..."
                        maxLength={1000}
                        className="w-full p-2 pb-6 bg-transparent resize-none outline-none placeholder:text-secondary text-secondary-light"
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-secondary">
                        {content.length}/1000
                    </div>
                </div>
            </div>

            {previews.length > 0 && (
                <div className="flex gap-2 flex-wrap ml-14 mt-2">
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
                                className="absolute top-2 right-2 bg-background/50 text-secondary-light rounded-full p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center py-2 border-t border-border-dark mt-2 ml-14">
                <label className="cursor-pointer text-primary">
                    <ImageIcon />
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
                    className="text-background px-6 py-2 rounded-full bg-secondary-light hover:bg-secondary-light/90 disabled:opacity-50"
                >
                    Envoyer
                </button>
            </div>
        </form>
    );
}
