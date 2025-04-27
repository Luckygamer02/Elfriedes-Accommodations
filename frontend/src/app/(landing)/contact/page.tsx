"use client";

import {Divider, Stack, Text, Title} from '@mantine/core';
import LandingContainer from "@/components/LandingPage/LandingContainer"

export default function ContactPage() {
    return (
        <LandingContainer>
            <Stack>
                <Title order={2}>Imprint</Title>
                <Divider/>

                <Text>
                    <strong>Company Name:</strong> Elfriede's Accommodation
                </Text>

                <Text>
                    <strong>Address:</strong><br/>
                    Elfriede Mustermann<br/>
                    Mountainview Street 42<br/>
                    12345 Alpine Village<br/>
                    Austria
                </Text>

                <Text>
                    <strong>Phone:</strong> +43 123 4567890
                </Text>

                <Text>
                    <strong>Email:</strong> contact@elfriedes-accommodation.at
                </Text>

                <Text>
                    <strong>Business Type:</strong> Private lodging and vacation rentals
                </Text>

                <Text>
                    <strong>VAT ID:</strong> ATU12345678 (if applicable)
                </Text>

                <Text size="sm" color="dimmed">
                    Responsible for content according to § 55 Abs. 2 RStV: Elfriede Mustermann
                </Text>

                <Divider/>

                <Title order={4}>Disclaimer</Title>

                <Text size="sm">
                    The content of this website has been created with the utmost care. However, we cannot guarantee the
                    accuracy, completeness, or timeliness of the content. As a service provider, we are responsible for
                    our
                    own content on these pages under general laws. We are not obliged to monitor transmitted or stored
                    third-party
                    information or to investigate circumstances that indicate illegal activity.
                </Text>
            </Stack>
        </LandingContainer>
    );

}