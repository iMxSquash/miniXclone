"use client";

import { useUser } from "@/app/context/UserContext";
import UploadAvatar from "../container/uploadAvatar";
import UploadBanner from "../container/uploadBanner";
import { useState } from "react";
import { Calendar } from "lucide-react";
import Image from "next/image";
import withAuth from "../hook/withAuth";
import FollowButton from "./followBtn";
import FollowListModal from "./followListModal";
import PostUser from "./postUser";

const ProfilUser = ({ userGeted }) => {
    const { user } = useUser();

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [editLocation, setEditLocation] = useState(user?.location || '');
    const [editBio, setEditBio] = useState(user?.bio || '');

    const [showModal, setShowModal] = useState(null);

    const openEditProfile = () => setIsEditProfileOpen(true);
    const closeEditProfile = () => setIsEditProfileOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/user/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName,
                    location: editLocation,
                    bio: editBio
                })
            });
            if (response.ok) {
                closeEditProfile();
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!user || !userGeted?.user) return null;

    return user._id === userGeted.user._id ? (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col px-4">
                <div className="font-bold text-2xl">
                    {user.name}
                </div>
                <div className="text-secondary">
                    {user.posts?.length || 0} posts
                </div>
            </div>
            <UploadBanner />
            <UploadAvatar />
            <div className="flex flex-col gap-3 px-4">
                <div className="flex justify-end">
                    <button className="text-secondary-light border border-secondary rounded-full px-4 py-2 font-bold"
                        onClick={() => openEditProfile()}>
                        Modifier
                    </button>
                </div>
                <div className="flex flex-col">
                    <div className="font-bold text-xl">
                        {user.name}
                    </div>
                    <div className="text-secondary">
                        {user.location}
                    </div>
                </div>
                <div className="">
                    {user.bio}
                </div>
                <div className="text-secondary flex gap-1 items-center">
                    <Calendar size={16} />
                    A rejoint l'application le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex gap-4">
                    <div className="text-secondary hover:underline" onClick={() => setShowModal("following")}>
                        <span className="text-secondary-light">{user.following?.length || 0}</span> following
                    </div>
                    <div className="text-secondary hover:underline" onClick={() => setShowModal("followers")}>
                        <span className="text-secondary-light">{user.followers?.length || 0}</span> followers
                    </div>
                </div>
            </div>
            {
                isEditProfileOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
                        <div className="bg-background text-secondary-light p-6 rounded-lg w-96">
                            <h2 className="font-black text-2xl mb-4">Modifier le profil</h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className='relative'>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Nom"
                                        className='peer bg-transparent text-secondary-light w-full rounded-sm pb-2 pt-6 px-4 border border-secondary transition-all focus:outline-none focus:border-primary focus:ring-primary placeholder:invisible'
                                    />
                                    <label
                                        className='absolute left-4 transition-all translate-y-2 peer-focus:translate-y-2 text-xs peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-focus:text-primary peer-focus:text-xs'
                                    >
                                        Nom
                                    </label>
                                </div>
                                <div className='relative'>
                                    <input
                                        type="text"
                                        value={editLocation}
                                        onChange={(e) => setEditLocation(e.target.value)}
                                        placeholder="Localisation"
                                        className='peer bg-transparent text-secondary-light w-full rounded-sm pb-2 pt-6 px-4 border border-secondary transition-all focus:outline-none focus:border-primary focus:ring-primary placeholder:invisible'
                                    />
                                    <label
                                        className='absolute left-4 transition-all translate-y-2 peer-focus:translate-y-2 text-xs peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-focus:text-primary peer-focus:text-xs'
                                    >
                                        Localisation
                                    </label>
                                </div>
                                <div className='relative'>
                                    <textarea
                                        value={editBio}
                                        onChange={(e) => setEditBio(e.target.value)}
                                        placeholder="Bio"
                                        className='peer bg-transparent text-secondary-light w-full rounded-sm pb-2 pt-6 px-4 border border-secondary transition-all focus:outline-none focus:border-primary focus:ring-primary placeholder:invisible'
                                        rows="4"
                                    />
                                    <label
                                        className='absolute left-4 transition-all translate-y-2 peer-focus:translate-y-2 text-xs peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-focus:text-primary peer-focus:text-xs'
                                    >
                                        Bio
                                    </label>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={closeEditProfile} className="px-4 py-2 border rounded-full">
                                        Annuler
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-full">
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {
                showModal && (
                    <FollowListModal
                        userId={user._id}
                        type={showModal}
                        onClose={() => setShowModal(null)}
                    />
                )
            }
            <PostUser userId={user._id} />
        </div >
    ) : (
        <div className="flex flex-col gap-2 px-4">
            <div className="flex flex-col">
                <div className="font-bold text-2xl">
                    {userGeted.user.name}
                </div>
                <div className="text-secondary">
                    {userGeted.user.posts?.length || 0} posts
                </div>
            </div>
            <div className="w-full max-h-96 cover -mb-12">
                <img
                    src={userGeted.user?.banner || "/uploads/defaultBanner.png"}
                    alt="Banner"
                    className="object-cover"
                />
            </div>
            <div className="w-24 h-24 -mb-12 ml-6">
                <Image
                    src={userGeted.user?.avatar || "/uploads/defaultAvatar.png"}
                    alt="Avatar"
                    width={96}
                    height={96}
                    className="w-full h-full rounded-full object-cover border-4 border-background"
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex justify-end">
                    <FollowButton userId={userGeted.user._id} />
                </div>
                <div className="flex flex-col">
                    <div className="font-bold text-xl">
                        {userGeted.user.name}
                    </div>
                    <div className="text-secondary">
                        {userGeted.user.location}
                    </div>
                </div>
                <div className="">
                    {userGeted.user.bio}
                </div>
                <div className="text-secondary flex gap-1 items-center">
                    <Calendar size={16} />
                    A rejoint l'application le {new Date(userGeted.user.createdAt).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex gap-4">
                    <div className="text-secondary hover:underline" onClick={() => setShowModal("following")}>
                        <span className="text-secondary-light">{userGeted.user.following?.length || 0}</span> following
                    </div>
                    <div className="text-secondary hover:underline" onClick={() => setShowModal("followers")}>
                        <span className="text-secondary-light">{userGeted.user.followers?.length || 0}</span> followers
                    </div>
                </div>
            </div>
            {
                showModal && (
                    <FollowListModal
                        userId={userGeted.user._id}
                        type={showModal}
                        onClose={() => setShowModal(null)}
                    />
                )
            }
            <PostUser userId={userGeted.user._id} />
        </div>
    );
};

export default withAuth(ProfilUser);
