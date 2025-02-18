"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useUser } from "@/app/context/UserContext";
import { io } from "socket.io-client";
import Modal from "../container/modal";

export default function CommentList({ comments }) {
    const [loadedComments, setLoadedComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user } = useUser();
    const [socket, setSocket] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('newComment', async (comment) => {
                try {
                    const res = await fetch(`/api/tweet/${comment._id}`);
                    if (res.ok) {
                        const data = await res.json();
                    }
                } catch (error) {
                    console.error("Error fetching new comment:", error);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('newComment');
            }
        };
    }, [socket]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                if (!comments || comments.length === 0) {
                    setLoading(false);
                    return;
                }

                const commentsData = await Promise.all(
                    comments.map(async (comment) => {
                        const commentId = typeof comment === 'object' ?
                            (comment._id || comment.toString()) :
                            comment;

                        try {
                            const res = await fetch(`/api/tweet/${commentId}`);
                            if (!res.ok) {
                                console.error(`Erreur pour le commentaire ${commentId}:`, await res.text());
                                return null;
                            }
                            const data = await res.json();
                            return data.tweet;
                        } catch (error) {
                            console.error(`Erreur pour le commentaire ${commentId}:`, error);
                            return null;
                        }
                    })
                );

                // filtrer les doublons par _id
                const uniqueComments = commentsData.filter((comment, index, self) =>
                    comment && index === self.findIndex(c => c && c._id === comment._id)
                );

                setLoadedComments(uniqueComments);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [comments]);

    const handleTweetClick = (commentId) => {
        router.push(`/tweet/${commentId}`);
    };

    const handleLike = async (commentId) => {
        const res = await fetch(`/api/tweet/${commentId}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
        });
        if (res.ok) {
            setLoadedComments(loadedComments.map(comment => {
                if (comment._id === commentId) {
                    const hasLiked = comment.likes.includes(user._id);
                    return {
                        ...comment,
                        likes: hasLiked
                            ? comment.likes.filter(id => id !== user._id)
                            : [...comment.likes, user._id]
                    };
                }
                return comment;
            }));
        }
    };

    const handleDelete = async (e, commentId) => {
        e.stopPropagation();
        setCommentToDelete(commentId);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!commentToDelete) return;

        try {
            const res = await fetch(`/api/tweet/${commentToDelete}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setLoadedComments(loadedComments.filter(comment => comment._id !== commentToDelete));
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
        setModalOpen(false);
        setCommentToDelete(null);
    };

    const handleAvatarClick = (e, authorId) => {
        e.stopPropagation();
        router.push(`/user/${authorId}`);
    };

    if (loading) return <Loading />;

    if (!comments?.length) {
        return (
            <div className="p-4 text-center text-secondary">
                Aucun commentaire
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col">
                <h2 className="p-4 font-bold text-xl border-b border-border-dark">
                    Commentaires
                </h2>
                {loadedComments.map((comment) => (
                    <div
                        key={comment._id}
                        className="flex p-4 border-b border-border-dark hover:bg-gray-50/5 cursor-pointer"
                        onClick={() => handleTweetClick(comment._id)}
                    >
                        <div className="w-[20%]">
                            <img
                                src={comment.author.avatar}
                                alt={comment.author.name}
                                className="rounded-full w-10 h-10 cursor-pointer hover:opacity-80"
                                onClick={(e) => handleAvatarClick(e, comment.author._id)}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[85%]">
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{comment.author.name}</span>
                                <span className="text-secondary text-sm">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-wrap">{comment.content}</p>
                            {comment.mediaFiles?.length > 0 && (
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    {comment.mediaFiles.map((url, index) => (
                                        <div key={index} className="relative pt-[100%]">
                                            <Image
                                                src={url}
                                                alt={`Media ${index + 1}`}
                                                fill
                                                className="absolute inset-0 object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-2 flex gap-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(comment._id);
                                    }}
                                    className={comment.likes?.includes(user._id) ? "text-red-500" : ""}
                                >
                                    ❤️ {comment.likes?.length || 0}
                                </button>
                                {user._id === comment.author._id && (
                                    <button
                                        onClick={(e) => handleDelete(e, comment._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setCommentToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Supprimer le commentaire"
                message="Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible."
            />
        </>
    );
}
