import React from 'react'
import Link from 'next/link'

export default function Navbar() {
    return (
        <>
            <nav className="flex justify-between items-center py-4">
                <p className="text-2xl font-bold text-gray-800">My Blog</p>
                <div className="flex space-x-4">
                    <Link href="/">
                        Home
                    </Link>
                    <Link href="/messages">
                        Messages
                    </Link>
                    <Link href="/search">
                        Search
                    </Link>
                </div>
            </nav>
        </>
    )
}
