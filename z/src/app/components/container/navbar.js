"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '../../context/UserContext';
import { redirect } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useUser();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        logout();
        redirect("/login");
    };

    return (
        <>
            {user && (
                <div className="h-[5dvh] overflow-hidden">
                    <nav className="flex justify-between items-center p-4 bg-blue-500">
                        <Link href="/">
                            Z
                        </Link>
                        <div className="flex space-x-4">

                            <Link href="/messages">
                                Messages
                            </Link>
                            <Link href="/search">
                                Search
                            </Link>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </nav>

                    {user && (
                        <div className='p-4 bg-red-300'>
                            <h2>Informations utilisateur :</h2>
                            <ul>
                                {Object.entries(user).map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{key}</strong>: {value?.toString()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
