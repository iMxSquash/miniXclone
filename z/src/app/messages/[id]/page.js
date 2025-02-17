"use client";

import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import MessageList from "../../components/messages/MessageList";
import SendMessage from "../../components/messages/SendMessage";
import useSocket from "../../components/hook/useSocket";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";

const ConversationPage = () => {
    const { id } = useParams();
    const { user } = useUser();
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState(null);

    useEffect(() => {
        fetchMessages();
        if (socket) {
            socket.on("newMessage", handleNewMessage);
            return () => socket.off("newMessage", handleNewMessage);
        }
    }, [socket, id]);

    const fetchMessages = async () => {
        const res = await fetch(`/api/conversation/${id}`);
        if (res.ok) {
            const data = await res.json();
            setMessages(data.messages);
            setConversation(data.conversation);
        }
    };

    const handleNewMessage = (message) => {
        if (message.conversationId === id) {
            setMessages(prev => [...prev, message]);
        }
    };

    if (!conversation) return <Loading />;

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border-dark">
                <h2 className="text-xl font-bold">
                    {conversation.participants
                        .filter(p => p._id !== user._id)
                        .map(p => p.name)
                        .join(", ")}
                </h2>
            </div>

            <MessageList messages={messages} currentUser={user} />

            <div className="border-t border-border-dark mt-auto">
                <SendMessage conversationId={id} />
            </div>
        </div>
    );
};

export default ConversationPage;
