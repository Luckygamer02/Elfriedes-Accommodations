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
    useMantineTheme
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSearch, IconMapPin, IconCalendar, IconUsers } from '@tabler/icons-react';
import LandingContainer from "@/components/LandingPage/LandingContainer";
import { useStyles } from '@/components/Searchbar/OverlappingSearch.styles'; // Assuming you move styles to separate file

interface OverlappingSearchProps {
    // Add any props if needed
}

const OverlappingSearch: React.FC<OverlappingSearchProps> = () => {
    const theme = useMantineTheme();
    const { classes } = useStyles();
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [guests, setGuests] = useState<string>('1');

    return (
        <Box>
            {/* Hero Banner Section */}
            <Box className={classes.heroSection}>
                <LandingContainer>
                    <Stack spacing={theme.spacing.md}>
                        <Title order={1} c="white" fw={700}>
                            Discover Your Perfect Holiday Home
                        </Title>
                        <Text c="white" fw={500} size="lg" mb="lg">
                            Find unique holiday houses and apartments for an unforgettable vacation
                        </Text>
                        <Button
                            variant="filled"
                            color="white"
                            radius="md"
                            sx={{
                                width: 'fit-content',
                                color: theme.colors.blue[6]
                            }}
                            size="md"
                        >
                            Explore Vacation Rentals
                        </Button>
                    </Stack>
                </LandingContainer>
            </Box>

            {/* Overlapping Search Bar */}
            <Container className={classes.searchContainer}>
                <Paper shadow="md" p="lg" radius="lg" className={classes.searchBar}>
                    <Group grow spacing="md" align="flex-end">
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
                            leftSection={<IconSearch size={16} />}
                            radius="md"
                            size="md"
                            sx={{
                                backgroundColor: theme.colors.blue[6],
                                marginTop: 'auto',
                                marginBottom: 0
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