"use client"

import Link from "next/link"

export default function Logo() {
    return (
        <div className="mb-2 md:mb-0 mr-auto">
            <Link href={"/"}>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-vacation-400 to-vacation-800 inline-block text-transparent bg-clip-text">
                    Elfriedes Accommodations
                </h1>
            </Link>
        </div>
    )
}