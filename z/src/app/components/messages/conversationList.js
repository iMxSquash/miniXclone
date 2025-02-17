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
                    className="block hover:bg-hover p-4 border-b border-border-dark"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">
                                {conversation.participants
                                    .filter(p => p._id !== user._id)
                                    .map(p => p.name)
                                    .join(", ")}
                            </h3>
                            {conversation.lastMessage && (
                                <p className="text-sm text-text-light truncate">
                                    {conversation.lastMessage.content || "Image envoyée"}
                                </p>
                            )}
                        </div>
                        {conversation.lastMessage && (
                            <span className="text-xs text-text-light">
                                {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}
