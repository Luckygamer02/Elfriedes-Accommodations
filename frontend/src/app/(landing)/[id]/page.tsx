// app/accommodations/[id]/page.tsx
"use client";
import '@mantine/dates/styles.css';
import { Accommodation, Rating } from "@/models/accommodation/accommodation";
import {
    Card,
    Text,
    Badge,
    Group,
    Grid,
    Image,
    Stack,
    Title,
    Paper,
    Button,
    NumberInput,
    TextInput,
    Textarea
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import useSWR from "swr";
import httpClient from "@/lib/httpClient";
import Loading from "@/components/loading";
import {RatingBadge} from "@/components/RatingBadge";
import {useParams, useRouter} from "next/navigation";
import {IconStarFilled, IconBed, IconBath, IconUsers, IconStar, IconMessage} from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';
import {useState} from "react";
import Link from "next/link";
import {PaginatedResponse} from "@/models/backend";
import { useAuthGuard } from '@/lib/auth/use-auth';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import {toast} from "sonner";
import LandingContainer from "@/components/LandingPage/LandingContainer";
import dynamic from 'next/dynamic';

export default function AccommodationDetailPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [guests, setGuests] = useState(1);

    const AccommodationMap = dynamic(
        () => import('@/components/AccommodationMap').then((mod) => mod.default),
        {
            ssr: false,
            loading: () => <p>Loading map...</p>
        }
    );
    const { data: accommodation, error, isLoading } = useSWR<Accommodation>(
        `api/accommodations/${id}`,
        () => httpClient.get<Accommodation>(`api/accommodations/${id}`).then(res => res.data)
    );
    const { data: Ratings } = useSWR<Rating[]>(
        `api/reviews/${id}`,
        () => httpClient.get<PaginatedResponse<Rating>>(`api/reviews/${id}`).then(res => res.data.content)
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

            <LandingContainer className="py-8">

            <Grid gutter="xl" mt="md">
                <Grid.Col>
                    <Stack gap="lg">
                        <Title order={1}>{accommodation.title}</Title>

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
                            {accommodation.address.zipCode} {accommodation.address.city} {", "}
                            {accommodation.address.country}<br />
                            {"‎"}
                        </Text>

                        <AccommodationMap address={
                            `${accommodation.address.street} ${accommodation.address.houseNumber}, 
                             ${accommodation.address.zipCode} ${accommodation.address.city}, 
                             ${accommodation.address.country}`
                        } />
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper p="lg" shadow="md" withBorder>
                        <Stack>
                            <Title order={3}>$ {accommodation.basePrice} night</Title>

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
                <Grid.Col>
                    <Paper p="md" shadow="sm">
                        <Stack>
                            <Title order={3} mb="sm">Reviews</Title>

                            {Ratings?.length === 0 ? (
                                <Text c="dimmed">No reviews yet. Be the first to write one!</Text>
                            ) : (
                                Ratings?.map(rating => (
                                    <RatingComp key={rating.id} review={rating} />
                                ))
                            )}

                            <RatingForm accommodationId={id} />
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
const reviewSchema = z.object({
    content: z.string().min(10, "Review must be at least 10 characters"),
    rating: z.number().min(1).max(5)
});

function RatingForm({ accommodationId }: { accommodationId: string }) {
    const { user } = useAuthGuard({ middleware: "auth" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            content: '',
            rating: 5
        },
        validate: zodResolver(reviewSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            setIsSubmitting(true);
            await httpClient.post(`/api/reviews`, {
                ...values,
                accommodationId
            });
            form.reset();
            setError(null);
            toast.success("Review submitted successfully!");
        } catch (err) {
            setError("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Paper p="md" shadow="sm" mt="lg">
            <Title order={4} mb="md">Write a Review</Title>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Rating"
                    {...form.getInputProps('rating')}
                    type="number"
                    min={1}
                    max={5}
                />
                <Textarea
                    label="Review"
                    placeholder="Share your experience..."
                    {...form.getInputProps('content')}
                    mt="sm"
                />
                {error && <Text c="red" mt="sm">{error}</Text>}
                <Button
                    type="submit"
                    mt="md"
                    loading={isSubmitting}
                    leftSection={<IconMessage size={18} />}
                >
                    Submit Review
                </Button>
            </form>
        </Paper>
    );
}

function RatingComp({ review }: { review: Rating }) {
    return (
        <Paper p="md" shadow="sm" mb="md">
            <Group justify="space-between" mb="xs">
                <div>
                    <Text fw={500}>{review.User.firstName} {review.User.lastName}</Text>
                    <Text size="sm" c="dimmed">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </Text>
                </div>
                <Group gap="xs">
                    {[...Array(5)].map((_, i) => (
                        <IconStar
                            key={i}
                            size={16}
                            fill={i < review.rating ? '#ffd43b' : 'none'}
                            color="#ffd43b"
                        />
                    ))}
                </Group>
            </Group>
            <Text>{review.content}</Text>
        </Paper>
    );
}