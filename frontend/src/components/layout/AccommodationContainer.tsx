import { Accommodation } from "@/models/accommodation/accommodation";
import Link from "next/link";
import { Badge, Image, Card, Group, Text } from "@mantine/core";
import { RatingBadge } from "@/components/Rating/RatingBadge";
import React from "react";
import { Carousel } from "@mantine/carousel";

interface AccommodationContainerProps {
    acc: Accommodation | null | undefined;
}

export default function AccommodationContainer({ acc }: AccommodationContainerProps) {
    // Early return if accommodation is null or undefined
    if (!acc) {
        return (
            <Card p="lg" shadow="md" radius="md" className="accommodation-card">
                <Text>No accommodation data available</Text>
            </Card>
        );
    }

    // Use optional chaining and nullish coalescing for safe property access
    const { id, title, basePrice, picturesurls = [], address } = acc;

    return (
        <Card
            p="lg"
            shadow="md"
            radius="md"
            className="accommodation-card"
            style={{ textDecoration: "none", cursor: "pointer" }}
        >
            <Card.Section className="card-image-section">
                <Carousel>
                    {picturesurls && picturesurls.length > 0 ? (
                        picturesurls.map((url, index) => (
                            <Carousel.Slide key={`${id}-image-${index}`}>
                                <Image
                                    src={url}
                                    height={220}
                                    alt={`${title || 'Accommodation'} photo ${index + 1}`}
                                    onError={(e) => {
                                        // Fallback for image loading errors
                                        (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                    }}
                                />
                            </Carousel.Slide>
                        ))
                    ) : (
                        <Carousel.Slide>
                            <Image
                                src="/placeholder-image.jpg"
                                height={220}
                                alt="No photos available"
                            />
                        </Carousel.Slide>
                    )}
                </Carousel>
                {id && <RatingBadge accommodationId={id} />}
            </Card.Section>

            <Link href={`/${id || ''}`} style={{ textDecoration: "none" }}>
                <Group mt="md" style={{ cursor: "pointer" }}>
                    <Text>{title || 'Unnamed Accommodation'}</Text>
                    <Badge color="teal" variant="light">
                        €{typeof basePrice === 'number' ? basePrice.toFixed(2) : '0.00'}/night
                    </Badge>
                </Group>
                <Text size="sm" mt="xs" style={{ cursor: "pointer" }}>
                    {address?.city || 'Location not specified'}
                </Text>
            </Link>
        </Card>
    );
}