"use client";
import Link from 'next/link';
import Image from 'next/image';

const SearchResponse = ({ users, tweets }) => {
    return (
        <div className="mt-4 space-y-4">
            {users?.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">Utilisateurs</h2>
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

            {tweets?.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">Tweets</h2>
                    {tweets.map((tweet) => (
                        <Link href={`/tweet/${tweet._id}`} key={tweet._id}>
                            <div className="p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
                                <p className="text-white">{tweet.content}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResponse;
