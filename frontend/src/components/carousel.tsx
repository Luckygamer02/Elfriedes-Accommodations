"use client";

import { Carousel } from "@mantine/carousel";
import Link from "next/link";
import { Button, Paper, Title } from "@mantine/core";
import classes from "../css/carousel.module.css";

const data = [
    { image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", title: "Best forests to visit in North America", category: "nature" },
    { image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", title: "Hawaii beaches review: better than you think", category: "beach" },
    { image: "https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", title: "Mountains at night: 12 best locations to enjoy the view", category: "nature" },
    { image: "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", title: "Aurora in Norway: when to visit for best experience", category: "nature" },
    { image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", title: "Best places to visit this winter", category: "tourism" },
    { image: "https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", title: "Active volcanos reviews: travel at your own risk", category: "nature" },
];

const categories = ["nature", "beach", "tourism"];

const categorizedData = categories.map((category) => ({
    category,
    items: data.filter((item) => item.category === category),
}));

interface CardProps {
    image: string;
    title: string;
}

function Card({ image, title }: CardProps) {
    return (
        <Paper shadow="md" p="xl" radius="md" style={{ backgroundImage: `url(${image})`, height: 250 }} className={classes.card}>
            <div className={classes.overlay}>
                <Title order={3} className={classes.title}>{title}</Title>
                <Link href={`/articles/${title.replace(/\s+/g, "-").toLowerCase()}`} passHref>
                    <Button component="a" variant="white" color="dark">Read article</Button>
                </Link>
            </div>
        </Paper>
    );
}

export default function CarouselComponent() {
    return (
        <div>
            {categorizedData.map(({ category, items }) => (
                <div key={category} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{category.toUpperCase()}</h2>
                    <Carousel
                        slideSize={{ base: "100%", sm: "33.33%" }}
                        slideGap={{ base: "xl", sm: 2 }}
                        align="start"
                        slidesToScroll={1}
                        loop={false}
                        containScroll="trimSnaps"
                        withControls
                        withIndicators
                    >
                        {items.map((item) => (
                            <Carousel.Slide key={item.title}>
                                <Card {...item} />
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                </div>
            ))}
        </div>
    );
}
