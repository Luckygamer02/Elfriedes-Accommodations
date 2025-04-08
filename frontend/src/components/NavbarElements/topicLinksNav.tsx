"use client"

import Link from "next/link"

export default function topicLinksNav() {
    return (
        <div className="flex items-center gap-x-2 justify-between mb-2 md:mb-0">
            <Link href={"/"}>
                <h1 className="text-xl font-bold">
                    Home
                </h1>
            </Link>
            <Link href={"/"}>
                <h1 className="text-xl font-bold">
                    Accommodations
                </h1>
            </Link>
            <Link href={"/about"}>
                <h1 className="text-xl font-bold">
                    About us
                </h1>
            </Link>
            <Link href={"/contact"}>
                <h1 className="text-xl font-bold">
                    Contact
                </h1>
            </Link>
        </div>
    )
}