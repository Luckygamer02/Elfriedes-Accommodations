"use client";
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import { Accommodation, AccommodationType, Festival, FestivalType } from "@/models/accommodation/accommodation";
import { Text, Title, Card, Group, Badge, Button, Container, Tabs } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import useSWR from "swr";
import { PaginatedResponse } from "@/models/backend";
import httpClient from "@/lib/httpClient";
import Loading from "@/components/loading";
import { useMediaQuery } from "@mantine/hooks";
import OverlappingSearch from "@/components/Searchbar/OverlappingSearch";
import React, { useState } from "react";
import { useAuthGuard } from "@/lib/auth/use-auth";
import AccommodationContainer from "@/components/layout/AccommodationContainer";
import { useRouter } from "next/navigation";

export default function Home() {
    // Hooks
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeTab, setActiveTab] = useState<string | null>("all");

    // Fetch accommodations
    const { data: accommodationsData, error: accommodationsError, isLoading: accommodationsLoading } = useSWR<PaginatedResponse<Accommodation>>(
        "api/accommodations",
        () => httpClient
            .get<PaginatedResponse<Accommodation>>("api/accommodations")
            .then((res) => res.data)
    );

    // Fetch festivals
    const { data: festivals, error: festivalsError, isLoading: festivalsLoading } = useSWR<Festival[]>(
        "api/festivals",
        () => httpClient
            .get<Festival[]>("api/festivals")
            .then((res) => res.data)
    );

    // Error handling
    if (accommodationsError || festivalsError) {
        console.error("Error fetching data:", accommodationsError || festivalsError);
        return <div>Error loading data</div>;
    }

    // Loading state
    if (accommodationsLoading || festivalsLoading || !accommodationsData || !festivals) {
        return <Loading />;
    }

    const accommodations = accommodationsData.content;

    // Category definitions
    const categories = [
        { title: 'Trending Flats', type: AccommodationType.FLAT },
        { title: 'Luxury Houses', type: AccommodationType.HOUSE },
        { title: 'Cozy Rooms', type: AccommodationType.ROOM },
        { title: 'Unique Stays', type: AccommodationType.UNIQUE },
    ];

    // Group festivals by type
    const festivalsByType = festivals.reduce((acc, festival) => {
        if (!acc[festival.festivalType]) {
            acc[festival.festivalType] = [];
        }
        acc[festival.festivalType].push(festival);
        return acc;
    }, {} as Record<FestivalType, Festival[]>);

    // Generate a map of festival IDs to their accommodations count
    const festivalAccommodationsMap = festivals.reduce((acc, festival) => {
        acc[festival.id] = accommodations.filter(accommodation =>
            accommodation.festivalistId === festival.id
        ).length;
        return acc;
    }, {} as Record<number, number>);

    // Get all festival types
    const festivalTypes = Object.keys(festivalsByType) as FestivalType[];

    // Helper function to get festival type color
    const getFestivalTypeColor = (type: FestivalType): string => {
        const typeColors: Record<string, string> = {
            ROCK: 'red',
            POP: 'pink',
            JAZZ: 'blue',
            ELECTRONIC: 'violet',
            FOLK: 'green',
            HIP_HOP: 'yellow',
            CLASSICAL: 'gray',
            ARTS: 'indigo',
            FILM: 'cyan',
            FOOD: 'orange',
            BEER: 'amber',
            CULTURAL: 'lime',
            PRIDE: 'rainbow',
            TECHNOLOGY: 'teal',
            GAMING: 'purple',
            SPORTS: 'emerald',
        };

        return typeColors[type] || 'blue';
    };

    // Format date function
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <OverlappingSearch />
            <main className="flex-grow">
                <Container size="xl" py="xl">
                    {/* SECTION 1: TRENDING CATEGORIES */}
                    <Title order={1} mb="xl">Find Your Perfect Stay</Title>
                    <div className="category-rows mb-12">
                        {categories.map((category) => (
                            <div key={category.type} className="category-row mb-8">
                                <Text size="xl" mb="md" w={600}>
                                    {category.title}
                                </Text>

                                <Carousel
                                    slideSize={{ base: '100%', sm: '50%', md: '33.333%', lg: '25%' }}
                                    slideGap="md"
                                    align="start"
                                    slidesToScroll={isMobile ? 1 : 2}
                                    dragFree
                                    withControls
                                >
                                    { accommodations?.length > 0 && accommodations
                                        .filter(acc => acc.type === category.type)
                                        .map((acc) => (
                                            <Carousel.Slide key={acc.id}>
                                                <AccommodationContainer acc={acc} />
                                            </Carousel.Slide>
                                        ))}
                                </Carousel>
                            </div>
                        ))}
                    </div>

                    {/* SECTION 2: FESTIVALS */}
                    <Title order={1} mb="xl">Upcoming Festivals</Title>

                    {/* Tabs for festival types */}
                    <Tabs
                        value={activeTab}
                        onChange={setActiveTab}
                        mb="xl"
                    >
                        <Tabs.List>
                            <Tabs.Tab value="all">All Festivals</Tabs.Tab>
                            {festivalTypes.map(type => (
                                <Tabs.Tab
                                    key={type}
                                    value={type}
                                    color={getFestivalTypeColor(type)}
                                >
                                    {type.replace('_', ' ')}
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>

                        {/* All Festivals Tab */}
                        <Tabs.Panel value="all" pt="md">
                            <div className="grid grid-cols-1 gap-6">
                                {festivalTypes.map(type => (
                                    <div key={type} className="mb-8">
                                        <Group p="apart" mb="md">
                                            <Title order={2} style={{ color: getFestivalTypeColor(type) }}>
                                                {type.replace('_', ' ')} Festivals
                                            </Title>
                                            <Badge size="lg" color={getFestivalTypeColor(type)}>
                                                {festivalsByType[type].length} Events
                                            </Badge>
                                        </Group>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {festivalsByType[type].map(festival => {
                                                const accommodationCount = festivalAccommodationsMap[festival.id] || 0;

                                                return (
                                                    <Card key={festival.id} shadow="sm" padding="lg" radius="md" withBorder>
                                                        <Group p="apart" mb="xs">
                                                            <Text w={500} size="lg">{festival.name}</Text>
                                                            <Badge color={getFestivalTypeColor(festival.festivalType)}>
                                                                {festival.festivalType.replace('_', ' ')}
                                                            </Badge>
                                                        </Group>

                                                        <Text size="sm" color="dimmed" mb="md">
                                                            {formatDate(festival.startDate)} - {formatDate(festival.endDate)}
                                                        </Text>

                                                        <Group p="apart" mt="md">
                                                            <Badge
                                                                size="lg"
                                                                color={accommodationCount > 0 ? "green" : "red"}
                                                            >
                                                                {accommodationCount > 0
                                                                    ? `${accommodationCount} Accommodations`
                                                                    : "No Accommodations"}
                                                            </Badge>

                                                            <Button
                                                                variant="light"
                                                                color="blue"
                                                                onClick={() => router.push(`/festivals/${festival.id}`)}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </Group>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Tabs.Panel>

                        {/* Individual Type Tabs */}
                        {festivalTypes.map(type => (
                            <Tabs.Panel key={type} value={type} pt="md">
                                <Group position="apart" mb="md">
                                    <Title order={2} style={{ color: getFestivalTypeColor(type) }}>
                                        {type.replace('_', ' ')} Festivals
                                    </Title>
                                    <Badge size="lg" color={getFestivalTypeColor(type)}>
                                        {festivalsByType[type].length} Events
                                    </Badge>
                                </Group>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {festivalsByType[type].map(festival => {
                                        const accommodationCount = festivalAccommodationsMap[festival.id] || 0;

                                        return (
                                            <Card key={festival.id} shadow="sm" padding="lg" radius="md" withBorder>
                                                <Group position="apart" mb="xs">
                                                    <Text weight={500} size="lg">{festival.name}</Text>
                                                    <Badge color={getFestivalTypeColor(type)}>
                                                        {type.replace('_', ' ')}
                                                    </Badge>
                                                </Group>

                                                <Text size="sm" color="dimmed" mb="md">
                                                    {formatDate(festival.startDate)} - {formatDate(festival.endDate)}
                                                </Text>

                                                <Group position="apart" mt="md">
                                                    <Badge
                                                        size="lg"
                                                        color={accommodationCount > 0 ? "green" : "red"}
                                                    >
                                                        {accommodationCount > 0
                                                            ? `${accommodationCount} Accommodations`
                                                            : "No Accommodations"}
                                                    </Badge>

                                                    <Button
                                                        variant="light"
                                                        color="blue"
                                                        onClick={() => router.push(`/festivals/${festival.id}`)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </Group>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </Tabs.Panel>
                        ))}
                    </Tabs>
                </Container>
            </main>
        </div>
    );
}