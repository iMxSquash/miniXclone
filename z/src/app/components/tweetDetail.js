import Image from "next/image";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";

export default function TweetDetail({ tweet }) {
    const { user } = useUser();
    const router = useRouter();

    const handleTweetClick = () => {
        router.push(`/tweet/${tweet._id}`);
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
                    className="w-12 h-12 rounded-full"
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
                <div>{tweet.likes?.length || 0} Likes</div>
                <div>{tweet.comments?.length || 0} Comments</div>
            </div>
        </div>
    );
}
