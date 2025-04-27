"use client";
import React from "react";
import {
    Container,
    Title,
    Text,
    Card,
    ThemeIcon,
    Accordion,
    List,
    Center,
    Space,
} from "@mantine/core";
import { IconShieldCheck } from "@tabler/icons-react";

export default function PrivacyPage() {
    return (
        <Container size="md" my="xl">
            <Center>
                <ThemeIcon variant="light" size="xl" radius="md" mb="lg">
                    <IconShieldCheck size={32} />
                </ThemeIcon>
            </Center>

            <Title order={2} align="center" mb="lg">
                Privacy Policy
            </Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Accordion variant="separated">
                    <Accordion.Item label="1. Data Controller">
                        <Text size="sm" mb="sm">
                            Company: Elfriede’s Accommodation
                            <br />
                            Responsible: Elfriede Mustermann
                            <br />
                            Address: Mountainview Street 42, 12345 Alpine Village, Austria
                            <br />
                            Phone: +43 123 4567890
                            <br />
                            Email: <a href="mailto:contact@elfriedes-accommodation.at">contact@elfriedes-accommodation.at</a>
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="2. Personal Data We Collect">
                        <List size="sm" spacing="xs">
                            <List.Item>Contact details (name, email, phone)</List.Item>
                            <List.Item>Booking details (dates, accommodation, price)</List.Item>
                            <List.Item>Technical log data (IP address, device and browser type)</List.Item>
                        </List>
                    </Accordion.Item>

                    <Accordion.Item label="3. Purpose of Processing">
                        <Text size="sm">
                            We process your data to handle your bookings, process payments, improve our service, and comply with legal obligations.
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="4. Legal Basis">
                        <Text size="sm">
                            Processing is based on Art. 6(1)(b) GDPR (performance of contract) and, where applicable, Art. 6(1)(f) GDPR (legitimate interests).
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="5. Data Retention">
                        <Text size="sm">
                            We retain your data for the duration of our business relationship and thereafter in accordance with statutory retention periods (e.g. 10 years for tax purposes).
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="6. Your Rights">
                        <List size="sm" spacing="xs">
                            <List.Item>Right of access (Art. 15 GDPR)</List.Item>
                            <List.Item>Right to rectification (Art. 16 GDPR)</List.Item>
                            <List.Item>Right to erasure (Art. 17 GDPR)</List.Item>
                            <List.Item>Right to object (Art. 21 GDPR)</List.Item>
                        </List>
                    </Accordion.Item>

                    <Accordion.Item label="7. Contact for Privacy Requests">
                        <Text size="sm">
                            For any privacy inquiries or to exercise your rights, please email us at{" "}
                            <a href="mailto:contact@elfriedes-accommodation.at">
                                contact@elfriedes-accommodation.at
                            </a>
                            .
                        </Text>
                    </Accordion.Item>

                    <Accordion.Item label="8. Disclaimer">
                        <Text size="sm">
                            The content of this Privacy Policy has been prepared with great care. However, we cannot guarantee its accuracy, completeness, or timeliness. As a service provider, we are responsible for our own content under general laws. We have no obligation to monitor transmitted or stored third-party content or to investigate circumstances indicating illegal activity.
                        </Text>
                    </Accordion.Item>
                </Accordion>
            </Card>

            <Space h="xl" />
            <Center>
                <Text size="xs" color="dimmed">
                    © {new Date().getFullYear()} Elfriede’s Accommodation. All rights reserved.
                </Text>
            </Center>
        </Container>
    );
}
