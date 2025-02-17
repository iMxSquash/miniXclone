import Image from "next/image";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSocket from "../hook/useSocket";
import Modal from "../container/modal";

export default function TweetDetail({ tweet, setTweet }) {
    const { user } = useUser();
    const router = useRouter();
    const socket = useSocket();
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const handleLikeUpdate = (data) => {
            if (data.tweetId === tweet._id) {
                setTweet(prev => ({
                    ...prev,
                    likes: data.likes
                }));
            }
        };

        socket.on("likeUpdate", handleLikeUpdate);

        return () => {
            socket.off("likeUpdate", handleLikeUpdate);
        };
    }, [socket, tweet._id]);

    const handleTweetClick = () => {
        router.push(`/tweet/${tweet._id}`);
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        const res = await fetch(`/api/tweet/${tweet._id}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
        });
        if (res.ok) {
            const newLikes = tweet.likes.includes(user._id)
                ? tweet.likes.filter(id => id !== user._id)
                : [...tweet.likes, user._id];
            
            // Émettre l'événement socket pour le like
            socket.emit("like", {
                tweetId: tweet._id,
                likes: newLikes
            });

            setTweet(prev => ({
                ...prev,
                likes: newLikes
            }));
        }
    };

    const handleRetweet = async (e) => {
        e.stopPropagation();
        try {
            const res = await fetch(`/api/tweet/${tweet._id}/replies`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Une erreur s'est produite");
                return;
            }

            setTweet(prev => ({
                ...prev,
                replies: data.tweet.replies
            }));
        } catch (error) {
            console.error("Retweet error:", error);
            alert("Une erreur s'est produite");
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`/api/tweet/${tweet._id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                router.push('/');
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
        setModalOpen(false);
    };

    const handleAvatarClick = (e) => {
        e.stopPropagation();
        router.push(`/user/${tweet.author._id}`);
    };

    return (
        <>
            <div
                onClick={handleTweetClick}
                className="flex flex-col p-4 border-b border-border-dark cursor-pointer"
            >
                {tweet.parentTweet && (
                    <div className="mb-3 p-3 border-l-2 border-gray-400"
                        onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tweet/${tweet.parentTweet._id}`);
                        }}
                    >
                        <div className="flex gap-3">
                            <img
                                src={tweet.parentTweet.author.avatar}
                                alt={tweet.parentTweet.author.name}
                                className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/user/${tweet.parentTweet.author._id}`);
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-sm">{tweet.parentTweet.author.name}</span>
                                <p className="text-sm text-gray-500">{tweet.parentTweet.content}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex gap-3">
                    <img
                        src={tweet.author.avatar}
                        alt={tweet.author.name}
                        className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
                        onClick={handleAvatarClick}
                    />
                    <div className="flex flex-col">
                        <span className="font-bold">{tweet.author.name}</span>
                        <p className="text-wrap">{tweet.content}</p>
                    </div>
                </div>
                {tweet.mediaFiles?.length > 0 && (
                    <div className="mt-2">
                        {tweet.mediaFiles.map((url, index) => (
                            <Image
                                key={index}
                                src={url}
                                width={200}
                                height={200}
                                alt="tweet media"
                                className="w-full rounded-lg"
                            />
                        ))}
                    </div>
                )}
                <div className="mt-4 text-secondary">
                    {new Date(tweet.createdAt).toLocaleString()}
                </div>
                <div className="flex gap-4 mt-4 border-t border-border-dark pt-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 ${tweet.likes?.includes(user._id) ? "text-red-500" : ""}`}
                    >
                        ❤️ <span>{tweet.likes?.length || 0}</span>
                    </button>
                    <button
                        onClick={handleRetweet}
                        className={`flex items-center gap-2 ${tweet.replies?.includes(user._id) ? "text-green-500" : ""}`}
                    >
                        🔄 <span>{tweet.replies?.length || 0}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        💬 <span>{tweet.comments?.length || 0}</span>
                    </div>
                    {user._id === tweet.author._id && (
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-700 flex items-center gap-2"
                        >
                            🗑️ <span>Supprimer</span>
                        </button>
                    )}
                </div>
            </div>
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer le tweet"
                message="Êtes-vous sûr de vouloir supprimer ce tweet ? Cette action est irréversible."
            />
        </>
    );
}
