"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

export default function MessageList({ messages, currentUser }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatDate = (date) => {
        return new Date(date).toLocaleString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
                {messages.map((message, index) => {
                    const isOwnMessage = message.sender._id === currentUser._id;

                    return (
                        <div
                            key={message._id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] ${isOwnMessage
                                        ? 'bg-primary text-white rounded-l-lg rounded-tr-lg'
                                        : 'bg-gray-100 rounded-r-lg rounded-tl-lg'
                                    } p-3`}
                            >
                                {!isOwnMessage && (
                                    <p className="text-sm font-semibold mb-1">
                                        {message.sender.name}
                                    </p>
                                )}

                                {message.content && (
                                    <p className="whitespace-pre-wrap break-words">
                                        {message.content}
                                    </p>
                                )}

                                {message.mediaFiles && message.mediaFiles.length > 0 && (
                                    <div className="mt-2 grid gap-2 grid-cols-2">
                                        {message.mediaFiles.map((file, index) => (
                                            <div key={index} className="relative aspect-square">
                                                <Image
                                                    src={file}
                                                    alt="Media"
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <p className={`text-xs mt-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'
                                    }`}>
                                    {formatDate(message.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
