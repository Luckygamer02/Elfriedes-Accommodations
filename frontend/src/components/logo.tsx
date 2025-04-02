"use client"

import Link from "next/link"

export default function Logo() {
    return (
        <div className="mb-2 md:mb-0">
        <Link href={"/"}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 inline-block text-transparent bg-clip-text">
                Elfriedes Accommodation Service
            </h1>
        </Link>
        </div>
    )
}