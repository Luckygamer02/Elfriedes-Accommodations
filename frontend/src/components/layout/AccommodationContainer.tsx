import {Accommodation} from "@/models/accommodation/accommodation";
import Link from "next/link";
import {Badge, Image, Card, Group, Text} from "@mantine/core";
import {RatingBadge} from "@/components/Rating/RatingBadge";
import React from "react";
import {Carousel} from "@mantine/carousel";

export default function AccommodationContainer({acc}: { acc: Accommodation }) {
    return (
        <Card
            p="lg"
            shadow="md"
            radius="md"
            className="accommodation-card"
            style={{textDecoration: "none", cursor: "pointer"}}
        >
            <Card.Section className="card-image-section">
                <Carousel>
                {acc.picturesurls?.length && ( acc.picturesurls.map( (url) =>
                    <Carousel.Slide>
                    <Image
                        src={url}
                    />
                    </Carousel.Slide>
                )
                )}
                </Carousel>
            <RatingBadge accommodationId={acc.id}/>
            </Card.Section>
            <Link href={`/${acc.id}`} style={{ textDecoration: "none" }}>
                <Group mt="md" style={{ cursor: "pointer" }}>
                    <Text>{acc.title}</Text>
                    <Badge color="teal" variant="light">
                        €{acc.basePrice}/night
                    </Badge>
                </Group>
                <Text size="sm" mt="xs" style={{ cursor: "pointer" }}>
                    {acc.address.city}
                </Text>
            </Link>
        </Card>
    );
}