import {Group, Paper, Stack, Text, Title} from "@mantine/core";
import {IconStar} from "@tabler/icons-react";
import {restClient} from "@/lib/httpClient";

type RatingsForAccProps = {
    accommodationId: number;
};
export default function RatingsForAcc({ accommodationId }: RatingsForAccProps  ) {
    const ratings = restClient.getReviewsForAccommodation(accommodationId);

    return (
        <Paper p="md" shadow="sm" mb="md">
            <Stack gap="lg">
                <Title order={4} mb="sm">Reviews ({ratings.length})</Title>

                {ratings.slice(0, 20).map((rating) => (
                    <Paper key={rating.id} p="sm" withBorder shadow="xs">
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <div>
                                    <Text fw={500}>
                                        {rating.User?.firstName} {rating.User?.lastName}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {new Date(rating.createdOn).toLocaleDateString()}
                                    </Text>
                                </div>

                                <Group gap={4}>
                                    {[...Array(5)].map((_, starIndex) => (
                                        <IconStar
                                            key={starIndex}
                                            size={16}
                                            fill={starIndex < rating.rating ? '#ffd43b' : 'none'}
                                            color="#ffd43b"
                                        />
                                    ))}
                                </Group>
                            </Group>

                            <Text>{rating.comment}</Text>
                        </Stack>
                    </Paper>
                ))}

                {ratings.length > 20 && (
                    <Text c="dimmed" ta="center">
                        Showing 20 most recent reviews
                    </Text>
                )}
            </Stack>
        </Paper>
    );
};