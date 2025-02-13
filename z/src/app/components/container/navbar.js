"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '../../context/UserContext';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import logo from '../../../../public/logo-w.svg';
import { Home, HomeIcon, MessageSquareText, Search, SearchIcon, User } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useUser();
    const [active, setActive] = useState("home");

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        logout();
        redirect("/login");
    };

    const goHome = () => {
        setActive("home");
        redirect("/");
    }

    const goSearch = () => {
        setActive("search");
        redirect("/search");
    };

    const goMessage = () => {
        setActive("messages");
        redirect("/messages");
    };

    const goUser = () => {
        setActive("user");
        redirect(`/user/${user._id}`);
    };

    return (
        <>
            {user && (
                <div className="h-[100dvh] w-28 border-r border-secondary p-2">
                    <nav className="flex flex-col items-center gap-8 p-2">
                        <button onClick={() => goHome()}>
                            <Image src={logo} alt='logo' className='w-5 fill-foreground' />
                        </button>
                        <div className="flex flex-col items-center gap-4">
                            <button
                                className={`flex items-center space-x-2 p-2 ${active === "home" ? "text-secondary-light" : "text-secondary"} hover:bg-secondary-dark/20 rounded-full`}
                                onClick={() => goHome()}
                            >
                                <Home size={`${active === "home" ? "30" : "24"}`} className='transition-all' />
                                <span className='hidden xl:flex'>Accueil</span>
                            </button>
                            <button
                                className={`flex items-center space-x-2 p-2 ${active === "search" ? "text-secondary-light" : "text-secondary"} hover:bg-secondary-dark/20 rounded-full`}
                                onClick={() => goSearch()}
                            >
                                <Search size={`${active === "search" ? "30" : "24"}`} className='transition-all' />
                                <span className='hidden xl:flex'>Rechercher</span>
                            </button>
                            <button
                                className={`flex items-center space-x-2 p-2 ${active === "messages" ? "text-secondary-light" : "text-secondary"} hover:bg-secondary-dark/20 rounded-full`}
                                onClick={() => goMessage()}
                            >
                                <MessageSquareText size={`${active === "messages" ? "30" : "24"}`} className='transition-all' />
                                <span className='hidden xl:flex'>Messages</span>
                            </button>
                            <button
                                className={`flex items-center space-x-2 p-2 ${active === "user" ? "text-secondary-light" : "text-secondary"} hover:bg-secondary-dark/20 rounded-full`}
                                onClick={() => goUser()}
                            >
                                <User size={`${active === "user" ? "30" : "24"}`} className='transition-all' />
                                <span className='hidden xl:flex'>Mon profile</span>
                            </button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </nav>
                </div>
            )}
        </>
    )
}
