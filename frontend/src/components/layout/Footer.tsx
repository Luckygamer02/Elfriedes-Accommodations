"use client";

import React from "react";
import Link from "next/link";
import {
    Box,
    Container,
    Grid,
    Title,
    Text,
    Anchor,
    Divider,
} from "@mantine/core";

export default function Footer() {

    return (
        <Box
            component="footer"
        >
            <Container size="lg">
                <Grid gutter="lg">
                    <Grid.Col span={{base:12, md:3}} >
                        <Title order={4} mb="xs">
                            Elfriedes Accommodations
                        </Title>
                        <Text>
                            Discover the most beautiful holiday apartments and vacation homes for your perfect getaway.
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{base:12, md:3}}>
                        <Title order={5} mb="xs">
                            About us
                        </Title>
                        <Text>
                            <Anchor component={Link} href="/about" >
                                About us
                            </Anchor>
                        </Text>
                        <Text mt="xs">
                            <Anchor component={Link} href="/contact">
                                Contact
                            </Anchor>
                        </Text>
                        <Text mt="xs">
                            <Anchor component={Link} href="/support">
                                Support
                            </Anchor>
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{base:12, md:3}}>
                        <Title order={5} mb="xs">
                            Legal
                        </Title>
                        <Text>
                            <Anchor component={Link} href="/terms" >
                                Terms &amp; Conditions
                            </Anchor>
                        </Text>
                        <Text mt="xs">
                            <Anchor component={Link} href="/privacy" >
                                Privacy
                            </Anchor>
                        </Text>
                    </Grid.Col>
                </Grid>

                <Divider
                    my="xl"
                />

                <Text size="sm" align="center">
                    &copy; {new Date().getFullYear()} Elfriedes Accommodations. All rights reserved.
                </Text>
            </Container>
        </Box>
    );
}
