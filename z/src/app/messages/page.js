"use client";

import Link from "next/link";
import { URL } from '../utils/constant/utls';
import withAuth from "../components/withAuth";
import useSocket from "../components/useSocket";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const Messages = () => {
  const { user } = useUser();

  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("message", handleMessage);

    // Nettoyage lors du démontage du composant
    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{user.name} - {msg}</li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2"
      />
      <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white">
        Envoyer
      </button>
    </div>
  );
}

export default withAuth(Messages);