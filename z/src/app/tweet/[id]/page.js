"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TweetDetail from "@/app/components/tweet/tweetDetail";
import AddComment from "@/app/components/tweet/addComment";
import CommentList from "@/app/components/tweet/commentList";
import withAuth from "@/app/components/hook/withAuth";
import Loading from "@/app/loading";

const TweetPage = () => {
    const { id } = useParams();
    const [tweet, setTweet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTweet = async () => {
            try {
                const res = await fetch(`/api/tweet/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setTweet(data.tweet);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tweet:", error);
                setLoading(false);
            }
        };

        fetchTweet();
    }, [id]);

    if (loading) return <Loading />;
    if (!tweet) return <div>Tweet not found</div>;

    return (
        <div className="flex flex-col gap-4">
            <TweetDetail tweet={tweet} setTweet={setTweet} />
            <AddComment tweetId={id} setTweet={setTweet} />
            <CommentList comments={tweet.comments} />
        </div>
    );
};

export default withAuth(TweetPage);