"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSocket from "./useSocket";
import Loading from "../loading";

export default function TweetList() {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

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
                                <button>❤️ {tweet.likes?.length || 0}</button>
                                <button>🔄 {tweet.retweets?.length || 0}</button>
                                <button>💬 {tweet.replies?.length || 0}</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
