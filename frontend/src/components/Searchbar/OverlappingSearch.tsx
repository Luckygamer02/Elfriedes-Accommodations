import React, { useState } from "react";
import {
    Container,
    Title,
    Text,
    Button,
    TextInput,
    Select,
    Paper,
    Group,
    Stack,
    Box,
    useMantineTheme,
    BackgroundImage
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSearch, IconMapPin, IconCalendar, IconUsers } from '@tabler/icons-react';
import LandingContainer from "@/components/LandingPage/LandingContainer";

interface OverlappingSearchProps {
    // Add any props here if needed
}

const OverlappingSearch: React.FC<OverlappingSearchProps> = () => {
    const theme = useMantineTheme();
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [guests, setGuests] = useState<string>('1');
    const sunsetBanner = "http://localhost:9000/pictures/sunsetBanner.jpg";

    return (
        <Box>
            {/* Hero Banner Section with Background Image */}
            <BackgroundImage
                src={sunsetBanner}
                style={{
                    padding: `${theme.spacing.xl} 0`,
                    position: 'relative',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '30vh', // Set minimum height
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <LandingContainer>
                    <Stack style={{ gap: theme.spacing.md }}>
                        <Title order={1} style={{
                            color: 'white',
                            fontWeight: 700,
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>
                            Discover Your Perfect Holiday Home
                        </Title>
                        <Text style={{
                            color: 'white',
                            fontWeight: 500,
                            fontSize: theme.fontSizes.lg,
                            marginBottom: theme.spacing.lg,
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}>
                            Find unique holiday houses and apartments for an unforgettable vacation
                        </Text>
                        <Button
                            variant="filled"
                            color="violet"
                            radius="md"
                            style={{
                                width: 'fit-content',
                                color: theme.white,
                                border: `1px solid ${theme.white}`,
                                fontSize: theme.fontSizes.md
                            }}
                            size="md"
                        >
                            Explore Vacation Rentals

                        </Button>
                    </Stack>
                </LandingContainer>
            </BackgroundImage>

            {/* Overlapping Search Bar */}
            <Container style={{
                position: 'relative',
                maxWidth: 1200,
                margin: '0 auto',
                marginTop: -50,
                zIndex: 1,
            }}>
                <Paper shadow="md" p="lg" radius="lg" style={{
                    padding: theme.spacing.lg,
                    borderRadius: theme.radius.lg,
                    boxShadow: theme.shadows.md,

                }}>
                    <Group grow style={{ gap: theme.spacing.md, alignItems: 'flex-end' }}>
                        <TextInput
                            label="Destination"
                            placeholder="City, Region or Accommodation"
                            leftSection={<IconMapPin size={16} />}
                            radius="md"
                        />

                        <DatePickerInput
                            type="range"
                            label="Vacation Period"
                            placeholder="Pick dates"
                            value={dateRange}
                            onChange={setDateRange}
                            leftSection={<IconCalendar size={16} />}
                            radius="md"
                        />

                        <Select
                            label="Visitors"
                            placeholder="Select guests"
                            data={[
                                { value: '1', label: '1 Guest' },
                                { value: '2', label: '2 Guests' },
                                { value: '3', label: '3 Guests' },
                                { value: '4', label: '4 Guests' },
                                { value: '5', label: '5+ Guests' },
                            ]}
                            value={guests}
                            onChange={(value) => setGuests(value || '1')}
                            leftSection={<IconUsers size={16} />}
                            radius="md"
                        />

                        <Button
                            variant="filled"
                            color="violet"
                            radius="md"
                            style={{
                                width: 'fit-content',
                                color: theme.white,
                                border: `1px solid ${theme.white}`,
                                fontSize: theme.fontSizes.md
                            }}
                            size="md"
                        >
                            Search Accommodation
                        </Button>
                    </Group>
                </Paper>
            </Container>
        </Box>
    );
};

export default OverlappingSearch;