"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSocket from "./useSocket";
import Loading from "../loading";
import { useUser } from "../context/UserContext";

export default function TweetList() {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    const { user } = useUser();

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

        socket.on("newTweet", handleNewTweet);

        return () => {
            socket.off("newTweet", handleNewTweet);
        };
    }, [socket]);

    const handleLike = async (tweetId) => {
        const res = await fetch(`/api/tweet/${tweetId}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id }) // Remplacez par l'ID de l'utilisateur actuel
        });
        if (res.ok) {
            setTweets(tweets.map(tweet => {
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
        const res = await fetch(`/api/tweet/${tweetId}/retweet`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
        });
        if (res.ok) {
            setTweets(tweets.map(tweet => {
                if (tweet._id === tweetId) {
                    const hasRetweeted = tweet.retweets.includes(user._id);
                    return {
                        ...tweet,
                        retweets: hasRetweeted
                            ? tweet.retweets.filter(id => id !== user._id)
                            : [...tweet.retweets, user._id]
                    };
                }
                return tweet;
            }));
        }
    };

    const handleReply = async (tweetId, content) => {
        const res = await fetch(`/api/tweet/${tweetId}/reply`, {
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
                        replies: [...tweet.replies, data.reply._id]
                    };
                }
                return tweet;
            }));
        }
    };

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                tweets.map((tweet) => (
                    <div key={tweet._id} className="flex justify-between w-full border-b border-border-dark p-4">
                        <div className="h-full w-[20%]">
                            <img src={tweet.author.avatar} alt={tweet.author.name} className="rounded-full w-12 h-12" />
                        </div>
                        <div className="flex flex-col gap-2 w-[75%]">
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
                                <button onClick={() => handleLike(tweet._id)}
                                    className={tweet.likes?.includes(user._id) ? "text-red-500" : ""}>
                                    ❤️ {tweet.likes?.length || 0}
                                </button>
                                <button onClick={() => handleRetweet(tweet._id)}
                                    className={tweet.retweets?.includes(user._id) ? "text-green-500" : ""}>
                                    🔄 {tweet.retweets?.length || 0}
                                </button>
                                <button onClick={() => {
                                    const content = prompt('Enter your reply:');
                                    if (content) handleReply(tweet._id, content);
                                }}>
                                    💬 {tweet.replies?.length || 0}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
