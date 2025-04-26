"use client";
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import {Accommodation, AccommodationType} from "@/models/accommodation/accommodation";
import {Text} from '@mantine/core';
import {Carousel} from '@mantine/carousel';
import useSWR from "swr";
import {PaginatedResponse} from "@/models/backend";
import httpClient from "@/lib/httpClient";
import Loading from "@/components/loading";
import {useMediaQuery} from "@mantine/hooks";
import OverlappingSearch from "@/components/Searchbar/OverlappingSearch";
import React, {useState} from "react";
import {useAuthGuard} from "@/lib/auth/use-auth";
import LandingContainer from "@/components/LandingPage/LandingContainer";
import AccommodationContainer from "@/components/layout/AccommodationContainer";

export default function Home() {
    // Alle Hooks werden oben aufgerufen – unabhängig von den Renderbedingungen!

    const randomPicture = "http://localhost:9000/webprojekt/user:1/accommodationpicture/63bbab01-48af-4742-b46d-bcd23339c3ac.avif";

    const isMobile = useMediaQuery('(max-width: 768px)');
    const {user} = useAuthGuard({middleware: "guest"});
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const {data, error, isLoading} = useSWR<PaginatedResponse<Accommodation>>(
        "api/accommodations",
        () =>
            httpClient
                .get<PaginatedResponse<Accommodation>>("api/accommodations")
                .then((res) => res.data)
    );

    // Nun die bedingten Returns
    if (error) {
        console.error("Error fetching accommodations:", error);
        return <div>Error loading accommodations</div>;
    }

    if (isLoading || !data) return <Loading/>;

    const accommodations = data.content;
    const categories = [
        {title: 'Trending Flats', type: AccommodationType.FLAT},
        {title: 'Luxury Houses', type: AccommodationType.HOUSE},
        {title: 'Cozy Rooms', type: AccommodationType.ROOM},
        {title: 'Unique Stays', type: AccommodationType.UNIQUE},
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <OverlappingSearch/>
            <main className="flex-grow">

                    <div className="category-rows">
                        {categories.map((category) => (
                            <div key={category.type} className="category-row">
                                <Text size="xl" mb="md">
                                    {category.title}
                                </Text>

                                <Carousel
                                    slideSize={{base: '100%', sm: '50%', md: '33.333%', lg: '25%'}}
                                    slideGap="md"
                                    align="start"
                                    slidesToScroll={isMobile ? 1 : 2}
                                    dragFree
                                    withControls
                                >
                                    {accommodations
                                        .filter(acc => acc.type === category.type)
                                        .map((acc) => (
                                            <Carousel.Slide key={acc.id}>
                                                <AccommodationContainer acc={acc}/>
                                            </Carousel.Slide>
                                        ))}
                                </Carousel>
                            </div>
                        ))}
                    </div>


            </main>
        </div>
    );
}