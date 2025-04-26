"use client";
import React from "react";
import {
    Container,
    Title,
    Text,
    Card,
    Accordion,
    Center,
    Space,
    ThemeIcon,
} from "@mantine/core";
import { IconClipboardList } from "@tabler/icons-react";

export default function TermsPage() {
    return (
        <Container size="md" my="xl">
            <Center>
                <ThemeIcon variant="light" size="xl" radius="md" mb="lg">
                    <IconClipboardList size={32} />
                </ThemeIcon>
            </Center>

            <Title order={2} align="center" mb="lg">
                Terms &amp; Conditions
            </Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Accordion variant="separated">
                    <Accordion.Item label="1. Introduction">
                        <Text size="sm" mb="sm">
                            Welcome to Elfriede’s Accommodation Service. By accessing or
                            using our website and booking platform, you agree to be bound by
                            these Terms &amp; Conditions.
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="2. Booking &amp; Payment">
                        <Text size="sm" mb="sm">
                            All bookings are subject to availability. Full payment or a
                            deposit may be required at the time of booking. We accept credit
                            cards, PayPal, and bank transfers.
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="3. Cancellation Policy">
                        <Text size="sm" mb="sm">
                            Cancellations made more than 14 days before check-in incur no
                            fee. Cancellations 7–14 days prior incur a 50% charge. Within 7
                            days, the full amount is non-refundable.
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="4. Check-In &amp; Check-Out">
                        <Text size="sm" mb="sm">
                            Standard check-in is from 3:00 PM. Check-out is by 11:00 AM. Early
                            check-in or late check-out may be available upon request and may
                            incur extra charges.
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="5. Guest Responsibilities">
                        <Text size="sm" mb="sm">
                            Guests must treat the property with care and respect the peace of
                            neighbors. Any damage or extraordinary cleaning costs will be
                            charged to the guest.
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="6. Liability">
                        <Text size="sm" mb="sm">
                            Elfriede’s Accommodation Service is not liable for loss, damage,
                            or injury to persons or property unless due to our negligence.
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="7. Governing Law">
                        <Text size="sm" mb="sm">
                            These Terms &amp; Conditions are governed by Austrian law. Any
                            disputes shall be subject to the exclusive jurisdiction of the
                            courts in Austria.
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="8. Contact">
                        <Text size="sm">
                            For any questions regarding these Terms &amp; Conditions, please
                            contact us at{" "}
                            <a href="mailto:contact@elfriedes-accommodation.at">
                                contact@elfriedes-accommodation.at
                            </a>
                            .
                        </Text>
                    </Accordion.Item>
                </Accordion>
            </Card>

            <Space h="xl" />
            <Center>
                <Text size="xs" color="dimmed">
                    © {new Date().getFullYear()} Elfriede’s Accommodation Service. All
                    rights reserved.
                </Text>
            </Center>
        </Container>
    );
}
