// components/layout/AccommodationRaster.tsx
import { Grid, Card } from '@mantine/core';
import { Accommodation } from '@/models/accommodation/accommodation';
import AccommodationContainer from "@/components/layout/AccommodationContainer";

interface AccommodationRasterProps {
    accommodations: Accommodation[];
}

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