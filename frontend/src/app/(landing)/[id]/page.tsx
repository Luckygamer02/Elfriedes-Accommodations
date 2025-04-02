// app/accommodations/[id]/page.tsx
"use client";
import '@mantine/dates/styles.css';
import { Accommodation } from "@/models/accommidation/accommodation";
import {Card, Text, Badge, Group, Grid, Image, Stack, Title, Paper, Button, NumberInput} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import useSWR from "swr";
import httpClient from "@/lib/httpClient";
import Loading from "@/components/loading";
import {RatingBadge} from "@/components/RatingBadge";
import {useParams, useRouter} from "next/navigation";
import { IconStarFilled, IconBed, IconBath, IconUsers } from '@tabler/icons-react';
import { AccommodationMap } from '@/components/AccommodationMap';
import { DatePicker } from '@mantine/dates';
import {useState} from "react";
import Link from "next/link";

export default function AccommodationDetailPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [guests, setGuests] = useState(1);

    const { data: accommodation, error, isLoading } = useSWR<Accommodation>(
        `api/accommodations/${id}`,
        () => httpClient.get<Accommodation>(`api/accommodations/${id}`).then(res => res.data)
    );
    //const { data: images } = useSWR<>()

    if (isLoading) return <Loading />;
    if (error) return <Text>Error loading accommodation details</Text>;
    if (!accommodation) return null;

    const totalPrice = () => {
        const [start, end] = dateRange;
        if (!start || !end) return 0;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * accommodation.basePrice * guests;
    };

    return (
        <div className="accommodation-detail-container">
            <Carousel withIndicators loop>
                {/*{accommodation.images?.map((image, index) => (*/}
                {/*    <Carousel.Slide key={index}>*/}
                {/*        <Image*/}
                {/*            src={image}*/}
                {/*            height={500}*/}
                {/*            alt={`Accommodation image ${index + 1}`}*/}
                {/*        />*/}
                {/*    </Carousel.Slide>*/}
                {/*))}*/}
            </Carousel>

            <Grid gutter="xl" mt="md">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="lg">
                        <Title order={1}>{accommodation.title}</Title>

                        <Group gap="sm">
                            <RatingBadge accommodationId={accommodation.id} />
                            <Badge color="teal" variant="light">
                                ${accommodation.basePrice}/night
                            </Badge>
                        </Group>

                        <Group gap="xl">
                            <Group gap="xs">
                                <IconBed size={18} />
                                <Text>{accommodation.bedrooms} bedrooms</Text>
                            </Group>
                            <Group gap="xs">
                                <IconBath size={18} />
                                <Text>{accommodation.bathrooms} bathrooms</Text>
                            </Group>
                            <Group gap="xs">
                                <IconUsers size={18} />
                                <Text>Sleeps {accommodation.people}</Text>
                            </Group>
                        </Group>

                        <Paper p="md" shadow="sm">
                            <Title order={3} mb="sm">Description</Title>
                            <Text>{accommodation.description}</Text>
                        </Paper>

                        <Paper p="md" shadow="sm">
                            <Title order={3} mb="sm">Location</Title>
                            <Text>
                                {accommodation.address.street} {accommodation.address.houseNumber}<br />
                                {accommodation.address.postalCode} {accommodation.address.city}<br />
                                {accommodation.address.country}
                            </Text>
                        </Paper>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Paper p="md" shadow="sm">
                        <Title order={3} mb="sm">Location Map</Title>
                        <AccommodationMap address={
                            `${accommodation.address.street} ${accommodation.address.houseNumber}, 
                             ${accommodation.address.postalCode} ${accommodation.address.city}, 
                             ${accommodation.address.country}`
                        } />
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper p="lg" shadow="md" withBorder>
                        <Stack>
                            <Title order={3}>Book this stay</Title>

                            <DatePicker
                                type="range"
                                value={dateRange}
                                onChange={setDateRange}
                                minDate={new Date()}
                                numberOfColumns={1}
                                allowSingleDateInRange
                            />

                            <NumberInput
                                label="Guests"
                                value={guests}
                                onChange={(value) => setGuests(typeof value === 'string' ? parseInt(value) || 1 : value)}
                                min={1}
                                max={accommodation.people}
                            />

                            <Group justify="space-between" mt="md">
                                <Text size="lg">Total:</Text>
                                <Text size="lg">${totalPrice()}</Text>
                            </Group>

                            <Button
                                fullWidth
                                size="lg"
                                mt="md"
                                component={Link}
                                href={{
                                    pathname: `/${id}/contactdetails`,
                                    query: {
                                        checkIn: dateRange[0]?.toISOString(),
                                        checkOut: dateRange[1]?.toISOString(),
                                        guests: guests,
                                        total: totalPrice()
                                    }
                                }}
                                disabled={!dateRange[0] || !dateRange[1]}
                            >
                                Book Now
                            </Button>
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>
        </div>
    );
}