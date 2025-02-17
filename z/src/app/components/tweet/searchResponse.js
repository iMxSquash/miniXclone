"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from 'react';

const SearchResponse = ({ users, tweets }) => {
    const { user } = useUser();
    const router = useRouter();
    const [localTweets, setLocalTweets] = useState(tweets);
    const [activeTab, setActiveTab] = useState("users");

    const handleLike = async (tweetId) => {
        const res = await fetch(`/api/tweet/${tweetId}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
        });
        if (res.ok) {
            setLocalTweets(localTweets.map(tweet => {
                if (tweet._id === tweetId) {
                    const hasLiked = tweet.likes.includes(user._id);
                    return {
                        ...tweet,
                        likes: hasLiked
                            ? tweet.likes.filter(id => id !== user._id)
                            : [...tweet.likes, user._id]
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

            if (res.ok) {
                setLocalTweets(localTweets.map(tweet => {
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
            }
        } catch (error) {
            console.error("Republication error:", error);
        }
    };

    const handleTweetClick = (e, tweetId) => {
        if (e.target.tagName.toLowerCase() === 'button') {
            return;
        }
        router.push(`/tweet/${tweetId}`);
    };

    const handleAvatarClick = (e, authorId) => {
        e.stopPropagation();
        router.push(`/user/${authorId}`);
    };

    return (
        <div className="mt-4">
            <div className="flex border-b border-border-dark mb-4">
                <button
                    className={`flex-1 py-4 text-center ${activeTab === "users" ? "border-b-2 border-primary text-primary" : "text-white"}`}
                    onClick={() => setActiveTab("users")}
                >
                    Utilisateurs
                </button>
                <button
                    className={`flex-1 py-4 text-center ${activeTab === "tweets" ? "border-b-2 border-primary text-primary" : "text-white"}`}
                    onClick={() => setActiveTab("tweets")}
                >
                    Tweets
                </button>
            </div>

            {activeTab === "users" && users?.length > 0 && (
                <div className="space-y-2">
                    {users.map((user) => (
                        <Link href={`/user/${user._id}`} key={user._id}>
                            <div className="flex items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
                                <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div className="ml-3">
                                    <p className="font-semibold text-white">{user.name}</p>
                                    <p className="text-gray-400">@{user.email}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {activeTab === "tweets" && localTweets?.length > 0 && (
                <div className="space-y-2">
                    {localTweets.map((tweet) => (
                        <div
                            key={tweet._id}
                            className="flex justify-between w-full border-b border-border-dark p-4 cursor-pointer hover:bg-gray-50/5"
                            onClick={(e) => handleTweetClick(e, tweet._id)}
                        >
                            <div className="h-full w-[20%]">
                                <img
                                    src={tweet.author.avatar}
                                    alt={tweet.author.name}
                                    className="rounded-full w-12 h-12 cursor-pointer hover:opacity-80"
                                    onClick={(e) => handleAvatarClick(e, tweet.author._id)}
                                />
                            </div>
                            <div className="flex flex-col gap-2 w-[75%]">
                                <div className="flex gap-4 align-top">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{tweet.author.name}</span>
                                        <p className="text-wrap">{tweet.content}</p>
                                    </div>
                                </div>
                                {tweet.mediaFiles?.length > 0 && (
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
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {((activeTab === "users" && users?.length === 0) ||
                (activeTab === "tweets" && localTweets?.length === 0)) && (
                    <p className="text-center text-gray-400 py-4">
                        Aucun résultat trouvé pour cet onglet
                    </p>
                )
            }
        </div >
    );
};

export default SearchResponse;
