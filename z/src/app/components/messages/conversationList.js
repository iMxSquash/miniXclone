"use client";

import { useState, useRef } from "react";
import { useUser } from "../../context/UserContext";
import useSocket from "../hook/useSocket";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';

export default function ConversationList({ conversations }) {
    const { user } = useUser();

    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.map(conversation => (
                <Link
                    key={conversation._id}
                    href={`/messages/${conversation._id}`}
                    className="block hover:bg-secondary/20 p-4 border-b border-border-dark"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="flex gap-2 mb-2">
                                {conversation.participants
                                    .filter(p => p._id !== user._id)
                                    .map(p => (
                                        <div key={p._id} className="w-8 h-8 rounded-full overflow-hidden bg-secondary-light">
                                            {p.avatar ? (
                                                <Image src={p.avatar} alt={p.name} width={32} height={32} className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon size={16} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    {conversation.participants
                                        .filter(p => p._id !== user._id)
                                        .map(p => p.name)
                                        .join(", ")}
                                </h3>
                                {conversation.lastMessage && (
                                    <p className="text-sm text-secondary-light truncate mt-1">
                                        {conversation.lastMessage.content || "Image envoyée"}
                                    </p>
                                )}
                            </div>
                        </div>
                        {conversation.lastMessage && (
                            <span className="text-xs text-secondary-light">
                                {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}
