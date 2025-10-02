"use client";
import React from "react";
import { Container, Title, Text, Grid, Card, List, ThemeIcon, Button, Center, Space } from "@mantine/core";
import { IconHome, IconUsers, IconHeart, IconMail } from "@tabler/icons-react";
import LogoCanvas from "@/components/layout/logocom";

export default function AboutPage() {
    return (
        <Container size="md" my="xl">
            <Center>
                <LogoCanvas />
            </Center>
            <Title  order={1} mb="sm">
                About Elfriedes Accommodation Service
            </Title>
            <Text   mb="lg">
                Your trusted partner for unforgettable stays across the World.
            </Text>

            <Grid gutter="md">
                <Grid.Col span={12} >
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <ThemeIcon variant="light" size="lg" radius="md" mb="sm">
                            <IconHome size={24} />
                        </ThemeIcon>
                        <Title order={3} mb="xs">
                            Our Mission
                        </Title>
                        <Text size="sm">
                            At Elfriedes, we believe that every journey deserves a place to feel at home. Our mission is to
                            provide warm, reliable, and comfortable accommodations that exceed expectations and create lasting memories.
                        </Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={12} >
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <ThemeIcon variant="light" size="lg" radius="md" mb="sm">
                            <IconUsers size={24} />
                        </ThemeIcon>
                        <Title order={3} mb="xs">
                            Our Story
                        </Title>
                        <Text size="sm" >
                            Founded in 2010 by Elfriede Gabel, our family-owned company has grown from a single guesthouse in
                            Bavaria to a network of premium properties across Germany, Austria, and Switzerland. We take pride
                            in our personal touch and local expertise.
                        </Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={12} >
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <ThemeIcon variant="light" size="lg" radius="md" mb="sm">
                            <IconHeart size={24} />
                        </ThemeIcon>
                        <Title order={3} mb="xs">
                            Our Values
                        </Title>
                        <List spacing="xs" size="sm"  mb="-xs">
                            <List.Item>Hospitality & Respect</List.Item>
                            <List.Item>Quality & Comfort</List.Item>
                            <List.Item>Transparency & Trust</List.Item>
                            <List.Item>Sustainability & Community</List.Item>
                        </List>
                    </Card>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <ThemeIcon variant="light" size="lg" radius="md" mb="sm">
                            <IconMail size={24} />
                        </ThemeIcon>
                        <Title order={3} mb="xs">
                            Get in Touch
                        </Title>
                        <Text size="sm" >
                            Have questions or need assistance? Our friendly support team is here 24/7 to help you find the perfect stay.
                        </Text>
                        <Space h="md" />
                        <Center>
                            <Button
                                component="a"
                                href="mailto:info@elfriedes-accommodation.com"
                                variant="outline"
                            >
                                Contact Us
                            </Button>
                        </Center>
                    </Card>
                </Grid.Col>
            </Grid>

            <Space h="xl" />
            <Center>
                <Text size="xs" >
                    &copy; {new Date().getFullYear()} Elfriedes Accommodation Service. All rights reserved.
                </Text>
            </Center>
        </Container>
    );
}
