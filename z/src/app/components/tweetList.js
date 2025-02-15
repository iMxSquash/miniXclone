"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TweetList() {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTweets() {
            const res = await fetch("/api/tweet");
            const data = await res.json();
            if (res.ok) {
                setTweets(data.tweets);
            }
            setLoading(false);
        }
        fetchTweets();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Chargement...</p>
            ) : (
                tweets.map((tweet) => (
                    <div key={tweet._id} className="border p-4 my-2">
                        <div className="flex items-center">
                            <Image src={tweet.author.avatar} width={20} height={20} alt={tweet.author.name} className="rounded-full" />
                            <span className="ml-2 font-bold">{tweet.author.name}</span>
                        </div>
                        <p className="mt-2">{tweet.content}</p>
                        {tweet.mediaFiles.length && tweet.mediaFiles.length > 0 && (
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
                ))
            )}
        </div>
    );
}
