import { Festival, FestivalType, Extra, CreateDiscountRequest } from "@/models/accommodation/accommodation";
import { Badge, Card, Checkbox, Group, Highlight, Stack, Text, Title, Tooltip } from "@mantine/core";
import useSWR from "swr";
import httpClient from "@/lib/httpClient";

type HighlightsProps = {
    festivalId?: number;
    extras?: Extra[];
    discounts?: CreateDiscountRequest[];
    selectedExtras: Extra[];
    setSelectedExtras: (extras: Extra[]) => void;
};

export default function Highlights({
                                       festivalId,
                                       extras = [],
                                       discounts = [],
                                       selectedExtras,
                                       setSelectedExtras,
                                   }: HighlightsProps) {
    // Fetch festival data if festivalId is provided
    const { data: festival } = useSWR(
        festivalId ? `api/festivals/${festivalId}` : null,
        festivalId ? () => httpClient.get<Festival>(`api/festivals/${festivalId}`).then(res => res.data) : null
    );

    // Format date helper function
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to get festival type color
    const getFestivalTypeColor = (type?: FestivalType): string => {
        if (!type) return 'blue';

        const typeColors: Record<string, string> = {
            ROCK: 'red',
            POP: 'pink',
            JAZZ: 'blue',
            ELECTRONIC: 'violet',
            FOLK: 'green',
            HIP_HOP: 'yellow',
            CLASSICAL: 'gray',
            ARTS: 'indigo',
            FILM: 'cyan',
            FOOD: 'orange',
            BEER: 'amber',
            CULTURAL: 'lime',
            PRIDE: 'rainbow',
            TECHNOLOGY: 'teal',
            GAMING: 'purple',
            SPORTS: 'emerald',
        };

        return typeColors[type] || 'blue';
    };

    // Helper function to format extra type display
    const formatExtraType = (type: string): string => {
        return type.replace(/_/g, ' ');
    };

    return (
        <Stack>
            {/* Festivals Section */}
            <Card shadow="sm" padding="lg">
                <Title order={3}>Festival Information</Title>
                {festival ? (
                    <div className="mt-3">
                        <Group position="apart" mb="xs">
                            <Text weight={700} size="lg">{festival.name}</Text>
                            <Badge color={getFestivalTypeColor(festival.festivalType)}>
                                {festival.festivalType?.replace(/_/g, ' ')}
                            </Badge>
                        </Group>
                        <Text size="sm" color="dimmed" mb="md">
                            {formatDate(festival.startDate)} - {formatDate(festival.endDate)}
                        </Text>
                    </div>
                ) : festivalId ? (
                    <Text mt="sm">Loading festival information...</Text>
                ) : (
                    <Text mt="sm">No festival selected.</Text>
                )}
            </Card>

            {/* Extras Section */}
            <Card shadow="sm" padding="lg">
                <Title order={3}>Extras</Title>
                {extras && extras.length > 0 ? (
                    <Checkbox.Group
                        value={selectedExtras.map((e) => e.type)}
                        onChange={(types) => {
                            setSelectedExtras(
                                extras.filter((e) => types.includes(e.type))
                            );
                        }}
                        className="mt-3"
                    >
                        {extras.map((extra) => (
                            <Checkbox
                                key={extra.type}
                                value={extra.type}
                                label={`${formatExtraType(extra.type)} (+€${extra.price.toFixed(2)}/night)`}
                                className="mb-2"
                            />
                        ))}
                    </Checkbox.Group>
                ) : (
                    <Text mt="sm">No available extras.</Text>
                )}
            </Card>

            {/* Available Discounts Section */}
            <Card shadow="sm" padding="lg">
                <Title order={3}>Available Discounts</Title>
                <Stack mt="sm">
                    {discounts && discounts.length > 0 ? (
                        discounts.map((discount, index) => (
                            <Group key={index} p="apart">
                                <Text>
                                    <Highlight highlight={discount.name}>
                                        {discount.name}
                                    </Highlight>
                                </Text>
                                <Tooltip label={`Valid until ${formatDate(discount.expiringDate)}`}>
                                    <Badge color="green" size="lg">
                                        {discount.discountprocent}% OFF
                                    </Badge>
                                </Tooltip>
                            </Group>
                        ))
                    ) : (
                        <Text>No available discounts.</Text>
                    )}
                </Stack>
            </Card>
        </Stack>
    );
}