"use client";
import '@mantine/carousel/styles.css';
import { Accommodation, AccommodationType } from "@/models/accommodation/accommodation";
import { Card, Text, Badge, Button, Group, Paper, Stack } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconStarFilled } from '@tabler/icons-react';
import useSWR from "swr";
import { PaginatedResponse } from "@/models/backend";
import httpClient from "@/lib/httpClient";
import Loading from "@/components/loading";
import { RatingBadge } from "@/components/RatingBadge";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import OverlappingSearch from "@/components/Searchbar/OverlappingSearch";
import { AccommodationNav } from "@/components/NavbarElements/accommodationNav";
import React, {useState} from "react";
import { useAuthGuard } from "@/lib/auth/use-auth";
import LandingContainer from "@/components/LandingPage/LandingContainer"
import {DatePicker} from "@mantine/dates";

export default function Home() {
    // Alle Hooks werden oben aufgerufen – unabhängig von den Renderbedingungen!
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { user } = useAuthGuard({ middleware: "guest" });
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const { data, error, isLoading } = useSWR<PaginatedResponse<Accommodation>>(
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

    if (isLoading || !data) return <Loading />;

    const accommodations = data.content;

    const categories = [
        { title: 'Trending Flats', type: AccommodationType.FLAT },
        { title: 'Luxury Houses', type: AccommodationType.HOUSE },
        { title: 'Cozy Rooms', type: AccommodationType.ROOM },
        { title: 'Unique Stays', type: AccommodationType.UNIQUE },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <OverlappingSearch />
            <main className="flex-grow">
                <LandingContainer className="py-8">
                    <div className="category-rows">
                        {categories.map((category) => (
                            <div key={category.type} className="category-row">
                                <Text size="xl" mb="md">
                                    {category.title}
                                </Text>

                                <Carousel
                                    slideSize={{ base: '100%', sm: '50%', md: '33.333%', lg: '25%' }}
                                    slideGap="md"
                                    align="start"
                                    slidesToScroll={isMobile ? 1 : 2}
                                    dragFree
                                    withControls
                                    withIndicators
                                >
                                    {accommodations
                                        .filter(acc => acc.type === category.type)
                                        .map((acc) => (
                                            <Carousel.Slide key={acc.id}>
                                                <Card
                                                    p="lg"
                                                    shadow="md"
                                                    className="accommodation-card"
                                                    radius="md"
                                                >
                                                    <Card.Section className="card-image-section">
                                                        {acc.picturesurls?.length ? (
                                                            <div
                                                                className="card-image"
                                                                style={{ backgroundImage: `url(${acc.picturesurls[0]})` }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="card-image"
                                                                style={{ backgroundImage: "url(/default-accommodation.jpg)" }}
                                                            />
                                                        )}
                                                        <Badge className="rating-badge" variant="gradient">
                                                            <IconStarFilled size={14} />
                                                            <RatingBadge accommodationId={acc.id} />
                                                        </Badge>
                                                    </Card.Section>

                                                    <Group mt="md">
                                                        <Text>{acc.title}</Text>
                                                        <Badge color="teal" variant="light">
                                                            ${acc.basePrice}/night
                                                        </Badge>
                                                    </Group>

                                                    <Text size="sm" mt="xs">
                                                        {acc.address.city}
                                                    </Text>

                                                    <Button
                                                        variant="light"
                                                        fullWidth
                                                        mt="md"
                                                        className="quick-view-button"
                                                        component={Link}
                                                        href={`/${acc.id}`}
                                                    >
                                                        Quick View
                                                    </Button>
                                                </Card>
                                            </Carousel.Slide>
                                        ))}
                                </Carousel>
                            </div>
                        ))}
                    </div>
                </LandingContainer>

                <Paper p="lg" shadow="md" withBorder>
                    <Stack>
                        <DatePicker
                            type="range"
                            value={dateRange}
                            onChange={setDateRange}
                            minDate={new Date()}
                            numberOfColumns={1}
                            allowSingleDateInRange
                        />
                    </Stack>
                </Paper>

                <AccommodationNav user={user} />
            </main>
        </div>
    );
}