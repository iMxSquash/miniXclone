import Image from "next/image";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";

export default function TweetDetail({ tweet, setTweet }) {
    const { user } = useUser();
    const router = useRouter();

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
            setTweet(prev => ({
                ...prev,
                likes: prev.likes.includes(user._id)
                    ? prev.likes.filter(id => id !== user._id)
                    : [...prev.likes, user._id]
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

    const handleAvatarClick = (e) => {
        e.stopPropagation();
        router.push(`/user/${tweet.author._id}`);
    };

    return (
        <div
            onClick={handleTweetClick}
            className="flex flex-col p-4 border-b border-border-dark cursor-pointer"
        >
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
            </div>
        </div>
    );
}
