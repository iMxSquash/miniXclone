"use client";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Image from "next/image";
import { ImageIcon, XCircle } from "lucide-react";
import { io } from "socket.io-client";

export default function AddComment({ tweetId, setTweet }) {
    const [content, setContent] = useState("");
    const [mediaFiles, setMediaFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const { user } = useUser();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim().length === 0 || isLoading) return;
        if (content.length > 280) return;

        setIsLoading(true);
        try {
            // Upload images first if any
            const uploadedUrls = [];
            if (mediaFiles.length > 0) {
                for (const file of mediaFiles) {
                    const formData = new FormData();
                    formData.append('file', file);

                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (uploadRes.ok) {
                        const { url } = await uploadRes.json();
                        uploadedUrls.push(url);
                    }
                }
            }

            // Create comment
            const res = await fetch(`/api/tweet/${tweetId}/replies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user._id,
                    content,
                    mediaFiles: uploadedUrls
                })
            });

            if (res.ok) {
                const data = await res.json();
                setTweet(prev => ({
                    ...prev,
                    comments: [...prev.comments, data.comment._id]
                }));
                
                // Émettre le nouveau commentaire via websocket
                if (socket) {
                    socket.emit('newComment', data.comment);
                }

                setContent("");
                setMediaFiles([]);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 4) {
            alert("Vous ne pouvez pas télécharger plus de 4 images");
            return;
        }
        setMediaFiles(files);
    };

    const removeFile = (index) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-b border-border-dark">
            <div className="flex gap-4">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Écrivez votre commentaire..."
                        className="w-full p-2 bg-transparent border-none focus:outline-none resize-none"
                        rows="3"
                    />
                    {mediaFiles.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {mediaFiles.map((file, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        className="w-full rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-1"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-primary hover:bg-primary/10 p-2 rounded-full"
                            >
                                <ImageIcon size={20} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />
                            <span className={`text-sm ${content.length > 280 ? 'text-red-500' : 'text-secondary'}`}>
                                {content.length}/280
                            </span>
                        </div>
                        <button
                            type="submit"
                            disabled={content.length === 0 || content.length > 280 || isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-full disabled:opacity-50"
                        >
                            {isLoading ? "Envoi..." : "Commenter"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
