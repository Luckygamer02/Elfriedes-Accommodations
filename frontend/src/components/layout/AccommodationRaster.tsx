import {Accommodation} from "@/models/accommodation/accommodation";
import {Badge,Image, Text, Card, Group, SimpleGrid, Stack} from "@mantine/core";

type AccommodationRasterProps = {
    accommodations : Accommodation[]
}
export default function AccommodationRaster({accommodations} : AccommodationRasterProps ) {
    return (
        <SimpleGrid
            cols={3}
            spacing="lg"
            breakpoints={[
                { maxWidth: 'md', cols: 2, spacing: 'md' },
                { maxWidth: 'sm', cols: 1, spacing: 'sm' },
            ]}
        >
            {accommodations.map((acc) => (
                <Card key={acc.id} shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                        {acc.picturesurls?.[0] ? (
                               <Image
                                  src={acc.picturesurls[0]}
                                  height={160}
                                  alt={acc.title}
                                  fit="cover"
                                />
                              ) : null}
                    </Card.Section>

                    <Stack spacing="xs" mt="md">
                        <Text weight={500}>{acc.title}</Text>
                        <Text size="sm" >
                            {acc.address.city}, {acc.address.street}
                        </Text>

                        <Group spacing="xs">
                            <Badge>🛏️ {acc.bedrooms}</Badge>
                            <Badge>🛁 {acc.bathrooms}</Badge>
                            <Badge>👥 {acc.people}</Badge>
                        </Group>

                        <Group position="apart" mt="md">
                            <Text weight={700}>€{acc.basePrice.toFixed(2)}</Text>
                        </Group>
                    </Stack>
                </Card>
            ))}
        </SimpleGrid>
    );
}
