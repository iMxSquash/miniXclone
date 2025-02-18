"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSocket from "../hook/useSocket";
import Loading from "../../loading";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import Modal from "../container/modal";
import { useToast } from "../../context/ToastContext";

export default function TweetList() {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();
    const router = useRouter();
    const { user } = useUser();
    const { showToast } = useToast();
    const [modalOpen, setModalOpen] = useState(false);
    const [tweetToDelete, setTweetToDelete] = useState(null);

    const fetchTweets = async () => {
        const res = await fetch("/api/tweet");
        const data = await res.json();
        if (res.ok) {
            setTweets(data.tweets);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTweets();

        if (!socket) return;

        const handleNewTweet = (tweet) => {
            setTweets((prev) => [tweet, ...prev]);
        };

        const handleLikeUpdate = (data) => {
            setTweets(prev => prev.map(tweet => {
                if (tweet._id === data.tweetId) {
                    return {
                        ...tweet,
                        likes: data.likes
                    };
                }
                return tweet;
            }));
        };

        socket.on("newTweet", handleNewTweet);
        socket.on("likeUpdate", handleLikeUpdate);

        return () => {
            socket.off("newTweet", handleNewTweet);
            socket.off("likeUpdate", handleLikeUpdate);
        };
    }, [socket]);

    const handleLike = async (tweetId) => {
        const res = await fetch(`/api/tweet/${tweetId}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id }) // remplacez par l'ID de l'utilisateur actuel
        });
        if (res.ok) {
            const updatedTweet = tweets.find(t => t._id === tweetId);
            const hasLiked = updatedTweet.likes.includes(user._id);
            const newLikes = hasLiked
                ? updatedTweet.likes.filter(id => id !== user._id)
                : [...updatedTweet.likes, user._id];
            
            // émettre l'événement socket pour le like
            socket.emit("like", {
                tweetId,
                likes: newLikes
            });

            setTweets(tweets.map(tweet => {
                if (tweet._id === tweetId) {
                    return {
                        ...tweet,
                        likes: newLikes
                    };
                }
                return tweet;
            }));
        }
    };

    const handleRetweet = async (tweetId) => {
        try {
            const res = await fetch(`/api/tweet/${tweetId}/replies`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });

            const data = await res.json();

            if (res.ok) {
                setTweets(tweets.map(tweet => {
                    if (tweet._id === tweetId) {
                        const hasReplied = tweet.replies?.includes(user._id);
                        return {
                            ...tweet,
                            replies: hasReplied
                                ? tweet.replies.filter(id => id !== user._id)
                                : [...(tweet.replies || []), user._id]
                        };
                    }
                    return tweet;
                }));
            } else {
                alert(data.error || "Une erreur s'est produite");
            }
        } catch (error) {
            console.error("Republication error:", error);
            alert("Une erreur s'est produite");
        }
    };

    const handleReply = async (tweetId, content) => {
        const res = await fetch(`/api/tweet/${tweetId}/replies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user._id,
                content
            })
        });
        if (res.ok) {
            const data = await res.json();
            setTweets(tweets.map(tweet => {
                if (tweet._id === tweetId) {
                    return {
                        ...tweet,
                        comments: [...tweet.comments, data.comment._id]
                    };
                }
                return tweet;
            }));
        }
    };

    const handleTweetClick = (e, tweetId) => {
        // empêcher la propagation si on clique sur un bouton
        if (e.target.tagName.toLowerCase() === 'button') {
            return;
        }
        router.push(`/tweet/${tweetId}`);
    };

    const handleAvatarClick = (e, authorId) => {
        e.stopPropagation();
        router.push(`/user/${authorId}`);
    };

    const handleDelete = async (e, tweetId) => {
        e.stopPropagation();
        setTweetToDelete(tweetId);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!tweetToDelete) return;

        try {
            const res = await fetch(`/api/tweet/${tweetToDelete}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setTweets(tweets.filter(tweet => tweet._id !== tweetToDelete));
                showToast('Tweet supprimé avec succès', 'success');
            } else {
                showToast('Erreur lors de la suppression du tweet', 'error');
            }
        } catch (error) {
            console.error("Delete error:", error);
            showToast('Erreur lors de la suppression du tweet', 'error');
        }
        setModalOpen(false);
        setTweetToDelete(null);
    };

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                tweets.map((tweet) => (
                    <div
                        key={tweet._id}
                        className="flex justify-between w-full border-b border-border-dark p-4 cursor-pointer hover:bg-gray-50/5"
                        onClick={(e) => handleTweetClick(e, tweet._id)}
                    >
                        <div className="h-full w-[20%] md:w-[10%]">
                            <img
                                src={tweet.author.avatar}
                                alt={tweet.author.name}
                                className="rounded-full w-12 h-12 cursor-pointer hover:opacity-80"
                                onClick={(e) => handleAvatarClick(e, tweet.author._id)}
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-[75%] md:w-[95%]">
                            <div className="flex gap-4 align-top">
                                <div className="flex flex-col">
                                    <span className="font-bold">{tweet.author.name}</span>
                                    <p className="text-wrap">{tweet.content}</p>
                                </div>
                            </div>
                            {tweet.mediaFiles.length > 0 && (
                                <div className="mt-2">
                                    {tweet.mediaFiles.map((url, index) => (
                                        <Image key={index} src={url} width={200} height={200} alt="tweet media" className="w-full rounded-lg" />
                                    ))}
                                </div>
                            )}
                            <div className="mt-2 flex gap-4">
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike(tweet._id);
                                }}
                                    className={tweet.likes?.includes(user._id) ? "text-red-500" : ""}>
                                    ❤️ {tweet.likes?.length || 0}
                                </button>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleRetweet(tweet._id);
                                }}
                                    className={tweet.replies?.includes(user._id) ? "text-green-500" : ""}>
                                    🔄 {tweet.replies?.length || 0}
                                </button>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/tweet/${tweet._id}`);
                                }}>
                                    💬 {tweet.comments?.length || 0}
                                </button>
                                {user._id === tweet.author._id && (
                                    <button 
                                        onClick={(e) => handleDelete(e, tweet._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setTweetToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Supprimer le tweet"
                message="Êtes-vous sûr de vouloir supprimer ce tweet ? Cette action est irréversible."
            />
        </div>
    );
}
