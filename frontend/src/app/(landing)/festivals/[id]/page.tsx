"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import {
    Container,
    Title,
    Text,
    Badge,
    Grid,
    Card,
    Group,
    Button,
    Tabs,
    Skeleton,
    Stack,
    Alert,
    Divider,
    Paper,
} from "@mantine/core";
import {
    CalendarCheck as IconCalendarEvent,
    MapPin as IconMapPin,
    Ticket as IconTicket,
    Bed as IconBed,
    Info as IconInfoCircle
} from "lucide-react";
import httpClient from "@/lib/httpClient";
import Loading from "@/components/loading";
import {
    Festival,
    FestivalType,
    Accommodation,
    AccommodationType
} from "@/models/accommodation/accommodation";
import { PaginatedResponse } from "@/models/backend";
import AccommodationContainer from "@/components/layout/AccommodationContainer";

// Type definitions for helper function returns and records
type FestivalTypeColorMap = Record<FestivalType | string, string>;
type AccommodationsByTypeMap = Partial<Record<AccommodationType, Accommodation[]>>;
type PriceRange = { min: number; max: number };

export default function FestivalDetailsPage() {
    const params = useParams();
    const festivalId = params?.id ? String(params.id) : "";
    const [activeTab, setActiveTab] = useState<string | null>("overview");

    // Fetch festival data
    const {
        data: festival,
        error: festivalError,
        isLoading: festivalLoading
    } = useSWR<Festival | null>(
        festivalId ? `api/festivals/${festivalId}` : null,
        festivalId ? () => httpClient
            .get<Festival>(`api/festivals/${festivalId}`)
            .then((res) => res.data)
            .catch((error) => {
                console.error("Error fetching festival:", error);
                return null;
            }) : null
    );

    // Fetch accommodations for this festival
    const {
        data: accommodationsData,
        error: accommodationsError,
        isLoading: accommodationsLoading
    } = useSWR<PaginatedResponse<Accommodation> | null>(
        festival?.id ? `api/accommodations?festivalId=${festival.id}` : null,
        festival?.id ? () => httpClient
            .get<PaginatedResponse<Accommodation>>(`api/accommodations?festivalId=${festival.id}`)
            .then((res) => res.data)
            .catch((error) => {
                console.error("Error fetching accommodations:", error);
                return null;
            }) : null
    );
    const accommodationsByType: AccommodationsByTypeMap = React.useMemo(() => {
        if (!accommodationsData?.content || !Array.isArray(accommodationsData.content)) {
            return {};
        }

        return accommodationsData.content.reduce<AccommodationsByTypeMap>((acc, accommodation) => {
            if (!accommodation || !accommodation.type) return acc;

            if (!acc[accommodation.type]) {
                acc[accommodation.type] = [];
            }

            acc[accommodation.type]?.push(accommodation);
            return acc;
        }, {});
    }, [accommodationsData?.content]);

    // Early returns for loading and error states
    if (festivalError) {
        return (
            <Container size="lg" py="xl">
                <Alert title="Error" color="red">
                    Failed to load festival details. Please try again later.
                </Alert>
            </Container>
        );
    }

    if (festivalLoading) {
        return <Loading />;
    }

    if (!festival) {
        return (
            <Container size="lg" py="xl">
                <Alert title="Not Found" color="yellow">
                    Festival not found.
                </Alert>
            </Container>
        );
    }

    // Helper function to get festival type color
    const getFestivalTypeColor = (type: FestivalType): string => {
        const typeColors: FestivalTypeColorMap = {
            [FestivalType.ROCK]: 'red',
            [FestivalType.POP]: 'pink',
            [FestivalType.JAZZ]: 'blue',
            [FestivalType.ELECTRONIC]: 'violet',
            [FestivalType.FOLK]: 'green',
            [FestivalType.HIP_HOP]: 'yellow',
            [FestivalType.CLASSICAL]: 'gray',
            [FestivalType.ARTS]: 'indigo',
            [FestivalType.FILM]: 'cyan',
            [FestivalType.FOOD]: 'orange',
            [FestivalType.BEER]: 'amber',
            [FestivalType.CULTURAL]: 'lime',
            [FestivalType.PRIDE]: 'rainbow',
            [FestivalType.TECHNOLOGY]: 'teal',
            [FestivalType.GAMING]: 'purple',
            [FestivalType.SPORTS]: 'emerald',
        };

        return typeColors[type] || 'blue';
    };

    // Format date helper function
    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'Date not available';

        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return 'Invalid date';
        }
    };

    // Calculate festival duration in days
    const calculateDuration = (startDate: string | null | undefined, endDate: string | null | undefined): number => {
        if (!startDate || !endDate) return 0;

        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays + 1; // Include both start and end days
        } catch (e) {
            console.error("Error calculating duration:", e);
            return 0;
        }
    };

    // Group accommodations by type


    const accommodationTypes = Object.keys(accommodationsByType) as AccommodationType[];
    const totalAccommodations = accommodationsData?.content?.length || 0;

    // Calculate price range
    const getPriceRange = (accommodations: Accommodation[] | undefined): PriceRange => {
        if (!accommodations || accommodations.length === 0) return { min: 0, max: 0 };

        try {
            const validPrices = accommodations
                .filter(acc => acc && typeof acc.basePrice === 'number')
                .map(acc => acc.basePrice);

            if (validPrices.length === 0) return { min: 0, max: 0 };

            return {
                min: Math.min(...validPrices),
                max: Math.max(...validPrices)
            };
        } catch (e) {
            console.error("Error calculating price range:", e);
            return { min: 0, max: 0 };
        }
    };

    const allAccommodations = accommodationsData?.content || [];
    const priceRange = getPriceRange(allAccommodations);

    // Format accommodation type for display
    const formatAccommodationType = (type: string): string => {
        if (!type) return 'Unknown';
        return type.charAt(0) + type.slice(1).toLowerCase();
    };

    // Safe festival name access
    const festivalName = festival?.name || 'Unknown Festival';
    const festivalType = festival?.festivalType || FestivalType.CULTURAL;
    const formattedFestivalType = festivalType.replace(/_/g, ' ');
    const startDate = festival?.startDate;
    const endDate = festival?.endDate;
    const duration = calculateDuration(startDate, endDate);
    const typeBadgeColor = getFestivalTypeColor(festivalType);

    return (
        <Container size="xl" py="xl">
            {/* Festival Hero Section */}
            <Paper
                radius="md"
                p="xl"
                shadow="md"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/api/placeholder/1200/400')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    marginBottom: '2rem'
                }}
            >
                <div className="text-center py-8">
                    <Badge size="xl" color={typeBadgeColor} mb="md">
                        {formattedFestivalType}
                    </Badge>
                    <Title order={1} className="text-white mb-4">
                        {festivalName}
                    </Title>
                    <Group p="center">
                        <Group>
                            <IconCalendarEvent size={20} />
                            <Text>{formatDate(startDate)} - {formatDate(endDate)}</Text>
                        </Group>
                        <Group>
                            <IconTicket size={20} />
                            <Text>{duration} days</Text>
                        </Group>
                    </Group>
                </div>
            </Paper>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
                <Tabs.List>
                    <Tabs.Tab value="overview" leftSection={<IconInfoCircle size={16} />}>
                        Overview
                    </Tabs.Tab>
                    <Tabs.Tab value="accommodations" leftSection={<IconBed size={16} />}>
                        Accommodations ({totalAccommodations})
                    </Tabs.Tab>
                </Tabs.List>

                {/* Festival Overview Tab */}
                <Tabs.Panel value="overview" pt="xl">
                    <Grid>
                        <Grid.Col md={8}>
                            <Card shadow="sm" p="lg" radius="md" withBorder>
                                <Title order={2} mb="md">About {festivalName}</Title>
                                <Text mb="xl">
                                    {festivalName} is an exciting {formattedFestivalType.toLowerCase()} festival
                                    taking place from {formatDate(startDate)} to {formatDate(endDate)}.
                                    Join thousands of festival-goers for {duration} days
                                    of amazing performances, great food, and unforgettable experiences.
                                </Text>

                                <Title order={3} mb="md">Accommodations Overview</Title>
                                <Text mb="md">
                                    We have {totalAccommodations} accommodations available for this festival, with prices ranging from
                                    €{priceRange.min.toFixed(2)} to €{priceRange.max.toFixed(2)} per night.
                                </Text>

                                <Group p="apart">
                                    {accommodationTypes.map(type => (
                                        <Card key={type} shadow="xs" p="md" radius="md" withBorder style={{ width: '48%' }} mb="md">
                                            <Title order={4}>{formatAccommodationType(type)}s</Title>
                                            <Text color="dimmed">
                                                {accommodationsByType[type]?.length || 0} available
                                            </Text>
                                            <Text>
                                                From €{getPriceRange(accommodationsByType[type]).min.toFixed(2)}/night
                                            </Text>
                                        </Card>
                                    ))}
                                </Group>

                                <Button
                                    variant="filled"
                                    color={typeBadgeColor}
                                    onClick={() => setActiveTab('accommodations')}
                                    fullWidth
                                    mt="lg"
                                >
                                    Browse All Accommodations
                                </Button>
                            </Card>
                        </Grid.Col>

                        <Grid.Col md={4}>
                            <Stack>
                                <Card shadow="sm" p="lg" radius="md" withBorder>
                                    <Title order={3} mb="md">Festival Details</Title>
                                    <Group p="apart" mb="xs">
                                        <Text w={500}>Type:</Text>
                                        <Badge color={typeBadgeColor}>
                                            {formattedFestivalType}
                                        </Badge>
                                    </Group>
                                    <Group p="apart" mb="xs">
                                        <Text w={500}>Dates:</Text>
                                        <Text>{formatDate(startDate)} - {formatDate(endDate)}</Text>
                                    </Group>
                                    <Group p="apart" mb="xs">
                                        <Text w={500}>Duration:</Text>
                                        <Text>{duration} days</Text>
                                    </Group>
                                    <Group p="apart" mb="xs">
                                        <Text w={500}>Accommodations:</Text>
                                        <Text>{totalAccommodations} available</Text>
                                    </Group>
                                </Card>

                                <Card shadow="sm" p="lg" radius="md" withBorder>
                                    <Title order={3} mb="md">Quick Links</Title>
                                    <Stack>
                                        <Button variant="light" leftSection={<IconBed size={16} />}>
                                            Book Accommodation
                                        </Button>
                                        <Button variant="light" leftSection={<IconTicket size={16} />}>
                                            Festival Tickets
                                        </Button>
                                        <Button variant="light" leftSection={<IconMapPin size={16} />}>
                                            View Location
                                        </Button>
                                    </Stack>
                                </Card>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Tabs.Panel>

                {/* Accommodations Tab */}
                <Tabs.Panel value="accommodations" pt="xl">
                    {accommodationsLoading ? (
                        <div>
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} height={200} mb="md" radius="md" />
                            ))}
                        </div>
                    ) : accommodationsError ? (
                        <Alert title="Error" color="red">
                            Failed to load accommodations. Please try again later.
                        </Alert>
                    ) : totalAccommodations === 0 ? (
                        <Alert title="No Accommodations" color="yellow">
                            There are currently no accommodations available for this festival.
                        </Alert>
                    ) : (
                        <>
                            <Title order={2} mb="xl">Accommodations for {festivalName}</Title>

                            {accommodationTypes.map(type => {
                                const typeAccommodations = accommodationsByType[type] || [];
                                return (
                                    <div key={type} className="mb-8">
                                        <Group p="apart" mb="md">
                                            <Title order={3}>{formatAccommodationType(type)}s</Title>
                                            <Badge size="lg">
                                                {typeAccommodations.length} available
                                            </Badge>
                                        </Group>

                                        <Grid>
                                            {typeAccommodations.map(accommodation => (
                                                <Grid.Col key={`accommodation-${accommodation?.id || Math.random()}`} md={6} lg={4}>
                                                    <AccommodationContainer acc={accommodation} />
                                                </Grid.Col>
                                            ))}
                                        </Grid>

                                        <Divider my="xl" />
                                    </div>
                                );
                            })}
                        </>
                    )}
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}