"use client";

import Image from "next/image";
import CarouselComponent from "@/components/carousel";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {/* Logo */}
                <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />

                {/* Überschrift und Einleitung */}
                <h1 className="text-3xl font-bold">Welcome to Our Landing Page</h1>
                <p className="text font-bold">Explore our amazing carousels below.</p>

                {/* Mehrere Carousels pro Kategorie */}
                <section className="w-full">
                    <CarouselComponent />
                </section>
            </main>

            {/* Footer */}
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <p>© 2025 Elfriedes Appartments. All rights reserved.</p>
            </footer>
        </div>
    );
}
