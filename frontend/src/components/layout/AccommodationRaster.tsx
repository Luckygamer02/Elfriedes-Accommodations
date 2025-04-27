// components/layout/AccommodationRaster.tsx
import { Grid, Card, Image as MantineImage, Text, Badge, Group, Button } from '@mantine/core';
import { Accommodation } from '@/models/accommodation/accommodation';
import Link from 'next/link';
import Image from 'next/image';

interface AccommodationRasterProps {
    accommodations: Accommodation[];
}

const DEFAULT_IMAGE = '/images/accommodation-placeholder.jpg'; // Make sure to add this to your public folder

export default function AccommodationRaster({ accommodations }: AccommodationRasterProps) {
    return (
        <Grid>
            {accommodations.map((accommodation) => {
                // Get the first image or use default
                const imageUrl = accommodation.picturesurls && accommodation.picturesurls.length > 0
                    ? accommodation.picturesurls[0]
                    : DEFAULT_IMAGE;

                return (
                    <Grid.Col xs={12} sm={6} md={4} key={accommodation.id}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Card.Section>
                                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                                    <Image
                                        src={imageUrl}
                                        alt={accommodation.title || 'Accommodation image'}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        onError={(e) => {
                                            // If image fails to load, replace with default
                                            (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                                        }}
                                    />
                                </div>
                            </Card.Section>

                            <Group p="apart" mt="md" mb="xs">
                                <Text w={500}>{accommodation.title || 'Unnamed Accommodation'}</Text>
                                <Badge color="blue" variant="light">
                                    {accommodation.type || 'N/A'}
                                </Badge>
                            </Group>

                            <Text size="sm" color="dimmed" mb="md">
                                {accommodation.address?.city || 'Location not specified'}
                            </Text>

                            <Group p="apart" mt="md">
                                <Text size="sm" color="dimmed">
                                    {accommodation.bedrooms || 0} bedroom{accommodation.bedrooms !== 1 ? 's' : ''} •
                                    {accommodation.bathrooms || 0} bathroom{accommodation.bathrooms !== 1 ? 's' : ''}
                                </Text>
                                <Text w={700}>€{accommodation.basePrice || 'N/A'}</Text>
                            </Group>

                            <Button
                                variant="light"
                                color="blue"
                                fullWidth
                                mt="md"
                                radius="md"
                                component={Link}
                                href={`/accommodations/${accommodation.id}`}
                            >
                                View Details
                            </Button>
                        </Card>
                    </Grid.Col>
                );
            })}
        </Grid>
    );
}