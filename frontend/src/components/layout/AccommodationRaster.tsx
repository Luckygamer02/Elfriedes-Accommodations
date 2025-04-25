import {Accommodation} from "@/models/accommodation/accommodation";
import {Grid, SimpleGrid} from "@mantine/core";
import AccommodationContainer from "@/components/layout/AccommodationContainer";

type AccommodationRasterProps = {
    accommodations: Accommodation[]
}
export default function AccommodationRaster({accommodations}: AccommodationRasterProps) {
    return (
        <Grid gutter="lg">
            {accommodations.map(acc => (
                <Grid.Col key={acc.id} span={{ base: 12, md: 6, lg: 3 }} >
                    <AccommodationContainer acc={acc} />
                </Grid.Col>
            ))}
        </Grid>
    );
}
