// components/Searchbar/OverlappingSearch.tsx
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
    const [guests, setGuests] = useState({
        adults: 1,
        children: 0,
        rooms: 1
    });
    const sunsetBanner = "http://localhost:9000/pictures/sunsetBanner.jpg";
    const router = useRouter();

    const handleGuestChange = (newValues: { adults: number; children: number; rooms: number }) => {
        setGuests(prev => ({...prev, ...newValues}));
    };

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
                    minHeight: '30vh',
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

                        <GuestSelectionPopover
                            adults={guests.adults}
                            children={guests.children}
                            rooms={guests.rooms}
                            onChange={handleGuestChange}
                        />

                        <Button
                            variant="filled"
                            color="violet"
                            radius="md"
                            size="md"
                            onClick={() => {
                                const params = new URLSearchParams();

                                if (dateRange[0]) {
                                    params.set('checkIn', dateRange[0].toISOString());
                                }
                                if (dateRange[1]) {
                                    params.set('checkOut', dateRange[1].toISOString());
                                }

                                params.set('adults', guests.adults.toString());
                                params.set('children', guests.children.toString());
                                params.set('rooms', guests.rooms.toString());

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
