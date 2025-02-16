"use client";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import Loading from "../loading";
import { useRouter } from "next/navigation";

export default function PostUser({ userId }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("posts");
    const [posts, setPosts] = useState([]);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        const fetchUserContent = async () => {
            try {
                const res = await fetch(`/api/user/${userId}/tweets`);
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.tweets || []);
                    setReplies(data.replies || []);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user content:", error);
                setLoading(false);
            }
        };

        fetchUserContent();
    }, [userId]);

    const handleLike = async (tweetId) => {
        const res = await fetch(`/api/tweet/${tweetId}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
        });
        if (res.ok) {
            const updateTweets = tweets => tweets.map(tweet => {
                if (tweet._id === tweetId) {
                    const hasLiked = tweet.likes.includes(user._id);
                    return {
                        ...tweet,
                        likes: hasLiked ? tweet.likes.filter(id => id !== user._id) : [...tweet.likes, user._id]
                    };
                }
                return tweet;
            });
            setPosts(updateTweets(posts));
            setReplies(updateTweets(replies));
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
            const updateTweets = tweets => tweets.map(tweet => {
                if (tweet._id === tweetId) {
                    return {
                        ...tweet,
                        replies: [...tweet.replies, data.reply._id]
                    };
                }
                return tweet;
            });
            setPosts(updateTweets(posts));
            setReplies(updateTweets(replies));
        }
    };

    const handleRetweet = async (tweetId) => {
        try {
            const res = await fetch(`/api/tweet/${tweetId}/replies`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });

            // ... reste du code de gestion de la réponse ...
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

    const renderTweet = (tweet) => (
        <div
            key={tweet._id}
            className="flex justify-between w-full border-b border-border-dark p-4 cursor-pointer hover:bg-gray-50/5"
            onClick={(e) => handleTweetClick(e, tweet._id)}
        >
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
                {tweet.mediaFiles?.length > 0 && (
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
                    <button onClick={() => {
                        const content = prompt('Enter your reply:');
                        if (content) handleReply(tweet._id, content);
                    }}>
                        💬 {tweet.replies?.length || 0}
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) return <Loading />;

    return (
        <div className="w-full">
            <div className="flex border-b border-border-dark">
                <button
                    className={`flex-1 py-4 text-center ${activeTab === "posts" ? "border-b-2 border-primary" : ""}`}
                    onClick={() => setActiveTab("posts")}
                >
                    Posts
                </button>
                <button
                    className={`flex-1 py-4 text-center ${activeTab === "replies" ? "border-b-2 border-primary" : ""}`}
                    onClick={() => setActiveTab("replies")}
                >
                    Replies
                </button>
            </div>
            <div>
                {activeTab === "posts" ?
                    posts.map(renderTweet) :
                    replies.map(renderTweet)
                }
            </div>
        </div>
    );
}
