// app/accommodations/[id]/page.tsx
"use client";
import '@mantine/dates/styles.css';
import { Accommodation } from "@/models/accommodation/accommodation";
import {
    Text,
    Badge,
    Group,
    Grid,
    Image,
    Stack,
    Title,
    Paper,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import useSWR from "swr";
import httpClient, {restClient} from "@/lib/httpClient";
import Loading from "@/components/loading";
import {RatingBadge} from "@/components/Rating/RatingBadge";
import {useParams} from "next/navigation";
import {IconBed, IconBath, IconUsers} from '@tabler/icons-react';
import LandingContainer from "@/components/LandingPage/LandingContainer";
import dynamic from 'next/dynamic';
import ReviewContainer from "@/components/Rating/RatingContainer";
import Highlights from "@/components/layout/Highlights";
import Sidebar from "@/components/layout/Sidebar";

export default function AccommodationDetailPage() {
    const id = Number(useParams<{ id : string }>().id );


    const AccommodationMap = dynamic(
        () => import('@/components/Map/AccommodationMap').then((mod) => mod.default),
        {
            ssr: false,
            loading: () => <p>Loading map...</p>
        }
    );
    const { data: accommodation, error, isLoading } = useSWR<Accommodation>(
        `api/accommodations/${id}`,
        () => httpClient.get<Accommodation>(`api/accommodations/${id}`).then(res => res.data)
    );


    if (isLoading) return <Loading />;
    if (error) return <Text>Error loading accommodation details</Text>;
    if (!accommodation) return null;


    return (
        <div className="accommodation-detail-container">

            <LandingContainer className="py-8">

            <Grid gutter="xl" mt="md">
                <Grid.Col>
                    <Stack gap="lg">
                        <Title order={1}>{accommodation.title}</Title>

                        <Carousel loop>
                            {accommodation.picturesurls?.map((image, index) => (
                                <Carousel.Slide key={index}>
                                    <Image
                                        src={image}
                                        height={500}
                                        alt={`Accommodation image ${index + 1}`}
                                    />
                                </Carousel.Slide>
                            ))}
                        </Carousel>
                        <p>
                            Hier Bilder
                        </p>


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
                                <Text>{accommodation.people} guests</Text>
                            </Group>
                        </Group>
                    </Paper>
                    <Paper p="md" shadow="sm">
                        <Title order={3} mb="sm">You will be here</Title>

                        <Text>
                            {accommodation.address.street} {accommodation.address.houseNumber} {", "}
                            {accommodation.address.postalCode} {accommodation.address.city} {", "}
                            {accommodation.address.country}<br />
                            {"‎"}
                        </Text>

                        <AccommodationMap address={
                            `${accommodation.address.street} ${accommodation.address.houseNumber}, 
                             ${accommodation.address.postalCode} ${accommodation.address.city}, 
                             ${accommodation.address.country}`
                        } />
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper p="lg" shadow="md" withBorder>
                        <Sidebar accommodation={accommodation} />
                    </Paper>
                </Grid.Col>
                <Grid.Col>
                    <Paper>
                        <Highlights
                            festivals={accommodation.festivalistId}
                            extras={accommodation.extras}

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
                <Group gap="sm">
                    <RatingBadge accommodationId={accommodation.id} />
                    <Badge color="teal" variant="light">
                        ${accommodation.basePrice}/night
                    </Badge>
                </Group>
            </LandingContainer>
        </div>
    );
}




