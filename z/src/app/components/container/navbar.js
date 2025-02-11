import React from 'react'
import Link from 'next/link'

export default function Navbar() {
    return (
        <>
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
                </div>
            </nav>
        </>
    )
}
