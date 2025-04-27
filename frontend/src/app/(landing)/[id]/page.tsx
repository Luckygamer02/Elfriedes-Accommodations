"use client";
import '@mantine/dates/styles.css';
import {Accommodation, Extra, FestivalType} from "@/models/accommodation/accommodation";
import {Badge, Grid, Group, Image, Paper, Stack, Text, Title,} from '@mantine/core';
import {Carousel} from '@mantine/carousel';
import useSWR from "swr";
import httpClient from "@/lib/httpClient";
import Loading from "@/components/loading";
import {RatingBadge} from "@/components/Rating/RatingBadge";
import {useParams} from "next/navigation";
import {IconBath, IconBed, IconUsers} from '@tabler/icons-react';
import LandingContainer from "@/components/LandingPage/LandingContainer";
import dynamic from 'next/dynamic';
import ReviewContainer from "@/components/Rating/RatingContainer";
import Highlights from "@/components/layout/Highlights";
import Sidebar from "@/components/layout/Sidebar";
import {modals} from "@mantine/modals";
import {ClickablePreviewImage} from "@/components/image/ClickablePreviewImage";
import {useState} from "react";

export default function AccommodationDetailPage() {
    const id = Number(useParams<{ id: string }>().id);
    const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);

    const AccommodationMap = dynamic(
        () => import('@/components/Map/AccommodationMap').then((mod) => mod.default),
        { ssr: true, loading: () => <p>Loading map...</p> }
    );

    const { data: accommodation, error, isLoading } = useSWR<{ content: Accommodation }>(
        `api/accommodations/${id}`,
        () => httpClient.get<{ content: Accommodation }>(`api/accommodations/${id}`).then(res => res.data)
    );



    if (isLoading) return <Loading/>;
    if (error) return <Text>Error loading accommodation details</Text>;
    if (!accommodation) return null;

    return (
        <div className="accommodation-detail-container">
            <LandingContainer className="py-8">
                <Grid gutter="xl" mt="md">
                    <Grid.Col>
                        <Stack gap="lg">
                            <Title order={1}>{accommodation.title}</Title>
                            <Group gap="sm">
                                <RatingBadge accommodationId={accommodation.id} />
                                <Badge color="teal" variant="light">
                                    ${accommodation.basePrice}/night
                                </Badge>
                            </Group>
                            <Carousel loop>
                                {accommodation.picturesurls?.map((image, index) => (
                                    <Carousel.Slide key={index}>
                                        <ClickablePreviewImage ImageURl={image} />
                                    </Carousel.Slide>
                                ))}
                            </Carousel>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Paper p="md" shadow="sm">
                            <Title order={3} mb="sm">{accommodation.description}</Title>
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
                                    <Text>{accommodation.people} Maximum Guests</Text>
                                </Group>
                            </Group>
                        </Paper>

                        <Paper p="md" shadow="sm" mt="md">
                            <Title order={3} mb="sm">Location</Title>
                            <Text>
                                {accommodation.address.street} {accommodation.address.houseNumber}, {" "}
                                {accommodation.address.postalCode} {accommodation.address.city}, {" "}
                                {accommodation.address.country}
                            </Text>
                            <AccommodationMap addressList={[
                                `${accommodation.address.street} ${accommodation.address.houseNumber}, 
                                ${accommodation.address.postalCode} ${accommodation.address.city}, 
                                ${accommodation.address.country}`
                            ]} />
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Paper p="lg" shadow="md" withBorder>
                            <Sidebar
                                accommodation={accommodation}
                                selectedExtras={selectedExtras}
                                setSelectedExtras={setSelectedExtras}
                            />
                        </Paper>
                    </Grid.Col>

                    <Grid.Col>
                        <Paper p="md" shadow="sm">
                            <Highlights
                                festivalId={accommodation.festivalistId}
                                extras={accommodation.extras}
                                discounts={accommodation.discounts}
                                selectedExtras={selectedExtras}
                                setSelectedExtras={setSelectedExtras}
                            />
                        </Paper>
                    </Grid.Col>

                    <Grid.Col>
                        <Paper p="md" shadow="sm">
                            <Stack>
                                <Title order={3} mb="sm">Reviews</Title>
                                <ReviewContainer accommodationId={id} />
                            </Stack>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </LandingContainer>
        </div>
    );
}