"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import useSocket from "./useSocket";
import { ArrowLeft, ArrowRight, ImageIcon, X } from "lucide-react";
import Image from "next/image";

export default function AddTweet() {
    const { user } = useUser();
    const socket = useSocket();
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);

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

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % previews.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + previews.length) % previews.length);
    };

    const renderImages = () => {
        const handleRemoveImage = (index) => {
            const newPreviews = previews.filter((_, i) => i !== index);
            const newImages = images.filter((_, i) => i !== index);
            setPreviews(newPreviews);
            setImages(newImages);
            if (currentSlide >= newPreviews.length) {
                setCurrentSlide(newPreviews.length - 1);
            }
        };

        if (previews.length === 0) return null;

        if (previews.length === 1) {
            return (
                <div className="relative">
                    <img src={previews[0]} alt="Preview" className="w-full h-40 object-cover rounded mt-2" />
                    <button
                        onClick={() => handleRemoveImage(0)}
                        className="absolute top-2 right-2 bg-background/50 text-secondary-light rounded-full p-1"
                    >
                        <X />
                    </button>
                </div>
            );
        }

        if (previews.length === 2) {
            return (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative">
                            <img src={preview} alt="Preview" className="h-40 w-full object-cover rounded" />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-background/50 text-secondary-light rounded-full p-1"
                            >
                                <X />
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="relative mt-2">
                <div className="grid grid-cols-2 gap-2">
                    {[0, 1].map((offset) => {
                        const index = (currentSlide + offset) % previews.length;
                        if (currentSlide + offset >= previews.length) return null;
                        return (
                            <div key={index} className="relative">
                                <img
                                    src={previews[index]}
                                    alt={`Preview ${index + 1}`}
                                    className="h-40 w-full object-cover rounded"
                                />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 bg-background/50 text-secondary-light rounded-full p-1"
                                >
                                    <X />
                                </button>
                            </div>
                        );
                    })}
                </div>
                {previews.length > 2 && (
                    <>
                        {currentSlide > 0 && (
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background bg-opacity-50 text-secondary-light p-1 rounded-full"
                            >
                                <ArrowLeft />
                            </button>
                        )}
                        {currentSlide < previews.length - 2 && (
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background bg-opacity-50 text-secondary-light p-1 rounded-full"
                            >
                                <ArrowRight />
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    };

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

    return (
        <div className="w-full p-6 border-b border-border-dark">
            {message && <p className="text-error">{message}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <div className="flex items-start gap-4 w-full">
                    <Image src={user.avatar} width={40} height={40} alt={user.name} className="rounded-full" />
                    <div className="relative w-full">
                        <textarea
                            ref={textareaRef}
                            placeholder="What is happening?!"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-2 pb-6 bg-transparent resize-none outline-none placeholder:text-secondary text-secondary-light"
                        />
                        <div className="absolute bottom-2 right-2 text-sm text-secondary">
                            {content.length}/280
                        </div>
                    </div>
                </div>
                {renderImages()}
                <div className="flex justify-between items-center py-2 border-t border-border-dark ms-12">
                    <label className="cursor-pointer text-primary">
                        <ImageIcon />
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                const newFiles = Array.from(e.target.files);
                                setImages(prev => [...prev, ...newFiles]);
                                setPreviews(prev => [...prev, ...newFiles.map(file => URL.createObjectURL(file))]);
                            }}
                            className="hidden"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={loading}
                        className="text-background px-6 py-2 rounded-full bg-secondary-light hover:bg-secondary-light/90"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}