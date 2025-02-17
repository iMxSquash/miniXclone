"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import ConversationList from "../components/messages/conversationList";
import SearchBar from "../components/messages/searchBar";
import NewConversationModal from "../components/messages/newConversationModal";
import withAuth from "../components/hook/withAuth";
import { CirclePlus } from "lucide-react";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();

  useEffect(() => {
    fetchConversations();
  }, [user._id]);

  const fetchConversations = async () => {
    const res = await fetch(`/api/conversation?userId=${user._id}`);
    if (res.ok) {
      const data = await res.json();
      setConversations(data);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border-dark">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Messages</h1>
          <CirclePlus size={40} className="p-2 rounded-full cursor-pointer hover:bg-secondary/20" onClick={() => setIsModalOpen(true)} />
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <ConversationList conversations={filteredConversations} />

      {isModalOpen && (
        <NewConversationModal
          onClose={() => setIsModalOpen(false)}
          onConversationCreated={fetchConversations}
        />
      )}
    </div>
  );
};

export default withAuth(Messages);