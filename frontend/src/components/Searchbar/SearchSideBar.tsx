// components/Searchbar/SearchSideBar.tsx
"use client";
import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Box, Button, Group, MultiSelect, NumberInput, Select, Stack, TextInput,} from '@mantine/core';
import {Extrastype} from '@/models/accommodation/accommodation';

const extrasOptions = Object.values(Extrastype).map((ext) => ({
    value: ext,
    label: ext.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase()),
}));

const bedroomOptions = Array.from({length: 5}, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
}));

export default function SearchSideBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Controlled form state
    const [city, setCity] = useState<string>(searchParams.get('city') || '');
    const [postalCode, setPostalCode] = useState<string>(searchParams.get('postalCode') || '');
    const [extras, setExtras] = useState<string[]>(searchParams.getAll('extras'));
    const [minPrice, setMinPrice] = useState<number | undefined>(() => {
        const v = searchParams.get('minPrice');
        return v ? Number(v) : undefined;
    });
    const [maxPrice, setMaxPrice] = useState<number | undefined>(() => {
        const v = searchParams.get('maxPrice');
        return v ? Number(v) : undefined;
    });
    const [bedrooms, setBedrooms] = useState<string | null>(searchParams.get('bedrooms'));

    // Update URL on submit
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (city) params.set('city', city);
        if (postalCode) params.set('postalCode', postalCode);
        if (minPrice != null) params.set('minPrice', String(minPrice));
        if (maxPrice != null) params.set('maxPrice', String(maxPrice));
        if (bedrooms) params.set('bedrooms', bedrooms);
        extras.forEach((ext) => params.append('extras', ext));
        router.push(`?${params.toString()}`);
    };

    return (
        <Box p="md" className="h-full overflow-y-auto">
            <form onSubmit={onSubmit}>
                <Stack>
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

                    <Group grow>
                        <NumberInput
                            label="Min Price"
                            placeholder="€"
                            value={minPrice}
                            onChange={setMinPrice}
                            min={0}
                        />
                        <NumberInput
                            label="Max Price"
                            placeholder="€"
                            value={maxPrice}
                            onChange={setMaxPrice}
                            min={0}
                        />
                    </Group>

                    <Select
                        label="Bedrooms"
                        placeholder="Select"
                        data={[{value: '', label: 'Any'}, ...bedroomOptions]}
                        value={bedrooms ?? ''}
                        onChange={(v) => setBedrooms(v || null)}
                    />

                    <MultiSelect
                        label="Extras"
                        placeholder="Select extras"
                        data={extrasOptions}
                        value={extras}
                        onChange={setExtras}
                    />

                    <Button type="submit" fullWidth mt="md">
                        Search
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}