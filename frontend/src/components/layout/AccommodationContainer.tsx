import {Accommodation} from "@/models/accommodation/accommodation";
import Link from "next/link";
import {Badge, Card, Group, Text} from "@mantine/core";
import {RatingBadge} from "@/components/Rating/RatingBadge";
import React from "react";

export default function AccommodationContainer({acc}: { acc: Accommodation }) {
    return (
        <Card
            component={Link}
            href={`/${acc.id}`}
            p="lg"
            shadow="md"
            radius="md"
            className="accommodation-card"
            style={{textDecoration: "none", cursor: "pointer"}}
        >
            <Card.Section className="card-image-section">
                {acc.picturesurls?.length ? (
                    <div
                        className="card-image"
                        style={{backgroundImage: `url(${acc.picturesurls[0]})`}}
                    />
                ) : (
                    <div
                        className="card-image"
                        style={{backgroundImage: "url(/default-accommodation.jpg)"}}
                    />
                )}

                <RatingBadge accommodationId={acc.id}/>

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
        </Card>
    );
}