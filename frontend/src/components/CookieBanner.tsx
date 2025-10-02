// components/CookieBanner.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Affix,
    Paper,
    Text,
    Button,
    Group,
    Title,
    ThemeIcon,
    Stack,
    rem,
} from "@mantine/core";
import { IconCookie } from "@tabler/icons-react";
import Cookies from "js-cookie";
import Link from "next/link";

export function CookieBanner() {
    const [visible, setVisible] = useState(false);

    // on mount, check if consent already set
    useEffect(() => {
        const consent = Cookies.get("cookieConsent");
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const accept = () => {
        Cookies.set("cookieConsent", "accepted", { expires: 365 });
        setVisible(false);
    };

    const decline = () => {
        Cookies.set("cookieConsent", "declined", { expires: 365 });
        setVisible(false);
    };

    if (!visible) {
        return null;
    }

    return (
        <Affix position={{ bottom: 0, left: 0, right: 0 }}>
            <Paper
                withBorder
                shadow="xl"
                radius="md"
                p="md"
            >
                <Group  align="center">
                    <ThemeIcon
                        variant="light"
                        size={rem(50)}
                        radius="md"
                        color="yellow"
                    >
                        <IconCookie size={rem(32)} stroke={1.5} />
                    </ThemeIcon>

                    <Stack >
                        <Title order={5}>We use cookies!</Title>
                        <Text size="sm">
                            To give you the best experience, we and our partners store cookies
                            on your device.{" "}
                            <Link
                                href="/privacy"
                                style={{ color: "inherit", textDecoration: "underline" }}
                            >
                                Learn more
                            </Link>
                            .
                        </Text>
                    </Stack>
                </Group>

                <Group>
                    <Button variant="outline" size="sm" onClick={decline}>
                        Decline
                    </Button>
                    <Button size="sm" onClick={accept}>
                        Accept
                    </Button>
                </Group>
            </Paper>
        </Affix>
    );
}
