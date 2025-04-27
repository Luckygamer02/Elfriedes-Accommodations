// components/Searchbar/SearchSideBar.tsx
"use client";
import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Box,
    Button,
    Group,
    MultiSelect,
    NumberInput,
    Select,
    Stack,
    TextInput,
    Text,
    Title,
    Accordion,
    Alert,
    RangeSlider,
} from '@mantine/core';
import {
    Extratype,
    AccommodationType,
    FestivalType,
    AccommodationFeatures
} from '@/models/accommodation/accommodation';
import React from 'react';

// Define type-safe option interfaces
interface SelectOption {
    value: string;
    label: string;
    group?: string;
}

// Create categorized options for FestivalType
const getFestivalTypeOptions = (): SelectOption[] => {
    const musicOptions = [
        FestivalType.ROCK, FestivalType.POP, FestivalType.JAZZ,
        FestivalType.ELECTRONIC, FestivalType.FOLK, FestivalType.HIP_HOP,
        FestivalType.CLASSICAL, FestivalType.WORLD
    ].map(value => ({
        value,
        label: value.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase()),
        group: 'Music'
    }));

    const artsOptions = [
        FestivalType.ARTS, FestivalType.FILM, FestivalType.THEATER,
        FestivalType.LITERATURE, FestivalType.DANCE, FestivalType.COMEDY,
        FestivalType.FASHION
    ].map(value => ({
        value,
        label: value.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase()),
        group: 'Arts & Culture'
    }));

    const foodOptions = [
        FestivalType.FOOD, FestivalType.WINE, FestivalType.BEER,
        FestivalType.STREET_FOOD, FestivalType.CHOCOLATE
    ].map(value => ({
        value,
        label: value.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase()),
        group: 'Food & Drink'
    }));

    const culturalOptions = [
        FestivalType.CULTURAL, FestivalType.RELIGIOUS, FestivalType.PRIDE,
        FestivalType.CARNIVAL, FestivalType.PARADE
    ].map(value => ({
        value,
        label: value.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase()),
        group: 'Cultural & Community'
    }));

    const seasonalOptions = [
        FestivalType.SPRING, FestivalType.SUMMER, FestivalType.AUTUMN,
        FestivalType.WINTER, FestivalType.FLOWER, FestivalType.LIGHT,
        FestivalType.FOOD_TRUCK
    ].map(value => ({
        value,
        label: value.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase()),
        group: 'Seasonal & Outdoors'
    }));

    const specializedOptions = [
        FestivalType.TECHNOLOGY, FestivalType.SCIENCE, FestivalType.GAMING,
        FestivalType.WELLNESS, FestivalType.ENVIRONMENT, FestivalType.FAMILY,
        FestivalType.SPORTS, FestivalType.MOTOR
    ].map(value => ({
        value,
        label: value.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase()),
        group: 'Specialized & Niche'
    }));

    return [
        ...musicOptions,
        ...artsOptions,
        ...foodOptions,
        ...culturalOptions,
        ...seasonalOptions,
        ...specializedOptions
    ];
};

// Create type-safe options for accommodation features
const featureOptions: SelectOption[] = [
    { value: 'ac', label: 'Air Conditioning' },
    { value: 'garden', label: 'Garden' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'microwave', label: 'Microwave' },
    { value: 'meetingTable', label: 'Meeting Table' },
    { value: 'pool', label: 'Pool' },
    { value: 'tv', label: 'TV' },
    { value: 'washingMachine', label: 'Washing Machine' },
    { value: 'wifi', label: 'WiFi' }
];

// Create options for extras
const extrasOptions: SelectOption[] = Object.values(Extratype).map((ext) => ({
    value: ext,
    label: ext.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase()),
}));

// Type-safe accommodation types
const accommodationTypeOptions: SelectOption[] = Object.values(AccommodationType).map(type => ({
    value: type,
    label: type.charAt(0) + type.slice(1).toLowerCase()
}));

// Options for rooms count
const generateCountOptions = (count: number): SelectOption[] =>
    Array.from({ length: count }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1)
    }));

const bedroomOptions = generateCountOptions(5);
const bathroomOptions = generateCountOptions(4);
const peopleOptions = generateCountOptions(12);
const livingRoomOptions = generateCountOptions(3);

// Sorting options
const sortOptions: SelectOption[] = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating_asc', label: 'Rating: Low to High' },
    { value: 'rating_desc', label: 'Rating: High to Low' },
    { value: 'newest', label: 'Newest First' }
];

// Define interface for paginated response to match backend
export interface PaginatedResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            unsorted: boolean;
            sorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export default function SearchSideBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Helper to safely get number param
    const getNumberParam = (name: string): number | undefined => {
        const value = searchParams.get(name);
        return value ? Number(value) : undefined;
    };

    // Helper to safely get string array param
    const getArrayParam = (name: string): string[] => {
        return searchParams.getAll(name);
    };

    // Controlled form state with type safety - aligned with backend parameter names
    const [city, setCity] = useState<string>(searchParams.get('city') || '');
    const [postalCode, setPostalCode] = useState<string>(searchParams.get('postalCode') || '');
    const [name, setName] = useState<string>(searchParams.get('name') || '');
    const [accommodationType, setAccommodationType] = useState<string | null>(searchParams.get('type'));
    const [festivalType, setFestivalType] = useState<string | null>(searchParams.get('festivalType'));
    const [extras, setExtras] = useState<string[]>(getArrayParam('extras'));
    const [features, setFeatures] = useState<string[]>(getArrayParam('features'));

    // Updated to use backend parameter names
    const [minBasePrice, setMinBasePrice] = useState<number | undefined>(getNumberParam('minBasePrice'));
    const [maxBasePrice, setMaxBasePrice] = useState<number | undefined>(getNumberParam('maxBasePrice'));
    const [minRating, setMinRating] = useState<number | undefined>(getNumberParam('minRating'));
    const [maxRating, setMaxRating] = useState<number | undefined>(getNumberParam('maxRating'));

    const [bedrooms, setBedrooms] = useState<string | null>(searchParams.get('bedrooms'));
    const [bathrooms, setBathrooms] = useState<string | null>(searchParams.get('bathrooms'));
    const [people, setPeople] = useState<string | null>(searchParams.get('people'));
    const [livingRooms, setLivingRooms] = useState<string | null>(searchParams.get('livingRooms'));
    const [festivalistId, setFestivalistId] = useState<number | undefined>(getNumberParam('festivalistId'));
    const [sortBy, setSortBy] = useState<string | null>(searchParams.get('sortBy') || 'price_asc');

    // Rating range state
    const [ratingRange, setRatingRange] = useState<[number, number]>([
        minRating || 0,
        maxRating || 5
    ]);

    // Update URL on submit with type-safe parameters
    const onSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();

        // Helper to safely add a parameter if it exists
        const addParam = (name: string, value: string | number | null | undefined) => {
            if (value !== null && value !== undefined && value !== '') {
                params.set(name, String(value));
            }
        };

        // Add all parameters - using correct backend parameter names
        addParam('city', city);
        addParam('postalCode', postalCode);
        addParam('name', name);
        addParam('type', accommodationType);
        addParam('festivalType', festivalType);
        addParam('minBasePrice', minBasePrice);
        addParam('maxBasePrice', maxBasePrice);
        addParam('minRating', ratingRange[0] > 0 ? ratingRange[0] : null);
        addParam('maxRating', ratingRange[1] < 5 ? ratingRange[1] : null);
        addParam('bedrooms', bedrooms);
        addParam('bathrooms', bathrooms);
        addParam('people', people);
        addParam('livingRooms', livingRooms);
        addParam('festivalistId', festivalistId);
        addParam('sortBy', sortBy);
        addParam('page', '0'); // Reset to first page on new search

        // Add array parameters
        extras.forEach(ext => params.append('extras', ext));
        features.forEach(feat => params.append('features', feat));

        router.push(`?${params.toString()}`);
    }, [
        city, postalCode, name, accommodationType, festivalType,
        minBasePrice, maxBasePrice, ratingRange, bedrooms, bathrooms,
        people, livingRooms, extras, features, festivalistId, sortBy, router
    ]);

    class ErrorBoundary extends React.Component {
        state = { hasError: false };

        static getDerivedStateFromError() {
            return { hasError: true };
        }

        render() {
            if (this.state.hasError) {
                return <Alert color="red">Error loading filter options</Alert>;
            }
            return this.props.children;
        }
    }

    // Fix reset function to properly clear all filters and URL parameters
    const resetForm = useCallback(() => {
        // Reset state values
        setCity('');
        setPostalCode('');
        setName('');
        setAccommodationType(null);
        setFestivalType(null);
        setExtras([]);
        setFeatures([]);
        setMinBasePrice(undefined);
        setMaxBasePrice(undefined);
        setRatingRange([0, 5]);
        setBedrooms(null);
        setBathrooms(null);
        setPeople(null);
        setLivingRooms(null);
        setFestivalistId(undefined);
        setSortBy('price_asc');

        // Reset URL parameters by navigating to base URL without query params
        router.replace('', { scroll: false });
    }, [router]);

    return (
        <Box p="md" className="h-full overflow-y-auto">
            <form onSubmit={onSubmit}>
                <Stack sp="md">
                    <Title order={4} mb="xs">Search Accommodations</Title>

                    <Accordion defaultValue="name">
                        <Accordion.Item value="name">
                            <Accordion.Control>Name Search</Accordion.Control>
                            <Accordion.Panel>
                                <TextInput
                                    label="Accommodation Name"
                                    placeholder="Search by name"
                                    value={name}
                                    onChange={(e) => setName(e.currentTarget.value)}
                                />
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="location">
                            <Accordion.Control>Location</Accordion.Control>
                            <Accordion.Panel>
                                <Stack sp="xs">
                                    <TextInput
                                        label="City"
                                        placeholder="Enter city"
                                        value={city}
                                        onChange={(e) => setCity(e.currentTarget.value)}
                                    />

                                    <TextInput
                                        label="Postal Code"
                                        placeholder="Enter postal code"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.currentTarget.value)}
                                    />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="price">
                            <Accordion.Control>Price</Accordion.Control>
                            <Accordion.Panel>
                                <Group grow>
                                    <NumberInput
                                        label="Min Price"
                                        placeholder="€"
                                        value={minBasePrice}
                                        onChange={(val) => setMinBasePrice(val || undefined)}
                                        min={0}
                                    />
                                    <NumberInput
                                        label="Max Price"
                                        placeholder="€"
                                        value={maxBasePrice}
                                        onChange={(val) => setMaxBasePrice(val || undefined)}
                                        min={0}
                                    />
                                </Group>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="rating">
                            <Accordion.Control>Rating</Accordion.Control>
                            <Accordion.Panel>
                                <Stack sp="xs">
                                    <Text size="sm">Rating Range: {ratingRange[0]} - {ratingRange[1]}</Text>
                                    <RangeSlider
                                        min={0}
                                        max={5}
                                        step={0.5}
                                        value={ratingRange}
                                        onChange={setRatingRange}
                                        marks={[
                                            { value: 0, label: '0' },
                                            { value: 1, label: '1' },
                                            { value: 2, label: '2' },
                                            { value: 3, label: '3' },
                                            { value: 4, label: '4' },
                                            { value: 5, label: '5' },
                                        ]}
                                    />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="rooms">
                            <Accordion.Control>Room Details</Accordion.Control>
                            <Accordion.Panel>
                                <Stack sp="xs">
                                    <Select
                                        label="Bedrooms"
                                        placeholder="Select"
                                        data={[{value: '', label: 'Any'}, ...bedroomOptions]}
                                        value={bedrooms ?? ''}
                                        onChange={(v) => setBedrooms(v)}
                                        clearable
                                    />

                                    <Select
                                        label="Bathrooms"
                                        placeholder="Select"
                                        data={[{value: '', label: 'Any'}, ...bathroomOptions]}
                                        value={bathrooms ?? ''}
                                        onChange={(v) => setBathrooms(v)}
                                        clearable
                                    />

                                    <Select
                                        label="Living Rooms"
                                        placeholder="Select"
                                        data={[{value: '', label: 'Any'}, ...livingRoomOptions]}
                                        value={livingRooms ?? ''}
                                        onChange={(v) => setLivingRooms(v)}
                                        clearable
                                    />

                                    <Select
                                        label="People"
                                        placeholder="Select"
                                        data={[{value: '', label: 'Any'}, ...peopleOptions]}
                                        value={people ?? ''}
                                        onChange={(v) => setPeople(v)}
                                        clearable
                                    />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="type">
                            <Accordion.Control>Property Type</Accordion.Control>
                            <Accordion.Panel>
                                <Select
                                    label="Accommodation Type"
                                    placeholder="Select type"
                                    data={[{value: '', label: 'Any'}, ...accommodationTypeOptions]}
                                    value={accommodationType ?? ''}
                                    onChange={(v) => setAccommodationType(v)}
                                    clearable
                                />
                            </Accordion.Panel>
                        </Accordion.Item>

                        <ErrorBoundary>
                            <Accordion.Item value="festival">
                                <Accordion.Control>Festival</Accordion.Control>
                                <Accordion.Panel>
                                    <Stack sp="xs">
                                        <Select
                                            label="Festival Type"
                                            placeholder="Select festival type"
                                            data={[
                                                { value: '', label: 'Any' },
                                                ...(getFestivalTypeOptions() || []) // Add null-check
                                            ]}
                                            value={festivalType ?? ''}
                                            onChange={(v) => setFestivalType(v)}
                                            clearable
                                            searchable
                                            nothingFoundMessage="No festival type found"
                                            maxDropdownHeight={280}
                                            styles={{
                                                item: (theme) => ({
                                                    '&[data-selected]': {
                                                        backgroundColor: theme.colors.blue[6],
                                                        color: theme.white,
                                                        '&:hover': {
                                                            backgroundColor: theme.colors.blue[7]
                                                        }
                                                    }
                                                })
                                            }}
                                        />

                                        <NumberInput
                                            label="Festival ID"
                                            placeholder="Enter festival ID"
                                            value={festivalistId}
                                            onChange={(val) => setFestivalistId(val || undefined)}
                                            min={1}
                                        />
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </ErrorBoundary>

                        <Accordion.Item value="features">
                            <Accordion.Control>Features & Extras</Accordion.Control>
                            <Accordion.Panel>
                                <Stack sp="xs">
                                    <MultiSelect
                                        label="Amenities"
                                        placeholder="Select amenities"
                                        data={featureOptions}
                                        value={features}
                                        onChange={setFeatures}
                                        searchable
                                    />

                                    <MultiSelect
                                        label="Extras"
                                        placeholder="Select extras"
                                        data={extrasOptions}
                                        value={extras}
                                        onChange={setExtras}
                                        searchable
                                    />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="sort">
                            <Accordion.Control>Sort Results</Accordion.Control>
                            <Accordion.Panel>
                                <Select
                                    label="Sort By"
                                    placeholder="Select sorting option"
                                    data={sortOptions}
                                    value={sortBy}
                                    onChange={(v) => setSortBy(v)}
                                    clearable={false}
                                />
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>

                    <Group p="apart" mt="md">
                        <Button variant="outline" onClick={resetForm}>
                            Reset
                        </Button>
                        <Button type="submit" fullWidth>
                            Search
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
}