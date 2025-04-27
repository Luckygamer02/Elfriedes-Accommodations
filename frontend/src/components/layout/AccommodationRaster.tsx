// components/layout/AccommodationRaster.tsx
import { Grid, Card, Image as MantineImage, Text, Badge, Group, Button } from '@mantine/core';
import { Accommodation } from '@/models/accommodation/accommodation';
import Link from 'next/link';
import Image from 'next/image';
import AccommodationContainer from "@/components/layout/AccommodationContainer";

interface AccommodationRasterProps {
    accommodations: Accommodation[];
}

const DEFAULT_IMAGE = '/images/accommodation-placeholder.jpg'; // Make sure to add this to your public folder

export default function AccommodationRaster({ accommodations }: AccommodationRasterProps) {
    return (
        <Grid>
            {accommodations.map((accommodation) => {
                // Get the first image or use default

                return (
                    <Grid.Col  sm={6} md={4} key={accommodation.id}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <AccommodationContainer acc={accommodation} />
                        </Card>
                    </Grid.Col>
                );
            })}
        </Grid>
    );
}