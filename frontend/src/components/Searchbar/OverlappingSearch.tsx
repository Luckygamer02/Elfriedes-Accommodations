import React, {useState} from "react";
import {
    BackgroundImage,
    Box,
    Button,
    Container,
    Group,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
    useMantineTheme
} from '@mantine/core';
import {DatePickerInput} from '@mantine/dates';
import {IconCalendar, IconMapPin} from '@tabler/icons-react';
import LandingContainer from "@/components/LandingPage/LandingContainer";
import GuestSelectionPopover from "@/components/Searchbar/GuestSelectionPopover";
import {useRouter} from 'next/navigation';

interface OverlappingSearchProps {
    // Add any props here if needed
}

const OverlappingSearch: React.FC<OverlappingSearchProps> = () => {
    const theme = useMantineTheme();
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [guests, setGuests] = useState<string>('1');
    const sunsetBanner = "http://localhost:9000/pictures/sunsetBanner.jpg";
    const router = useRouter();
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
                    <Stack style={{gap: theme.spacing.md}}>
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
                    <Group grow style={{gap: theme.spacing.md, alignItems: 'flex-end'}}>
                        <TextInput
                            label="Destination"
                            placeholder="City, Region or Accommodation"
                            leftSection={<IconMapPin size={16}/>}
                            radius="md"
                        />

                        <DatePickerInput
                            type="range"
                            label="Vacation Period"
                            placeholder="Pick dates"
                            value={dateRange}
                            onChange={setDateRange}
                            leftSection={<IconCalendar size={16}/>}
                            radius="md"
                        />

                        <GuestSelectionPopover />

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
                            onClick={() => {
                                // build params manually, only adding defined values
                                const params = new URLSearchParams();
                                if (dateRange[0]) {
                                    params.set('checkIn', dateRange[0].toISOString());
                                }
                                if (dateRange[1]) {
                                    params.set('checkOut', dateRange[1].toISOString());
                                }
                                params.set('guests', guests);


                                // Push the full URL
                                router.push(`/search?${params.toString()}`);
                            }}
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