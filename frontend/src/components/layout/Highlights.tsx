import {CreateDiscountRequest, Extra,} from "@/models/accommodation/accommodation";
import {Badge, Card, Checkbox, Group, Highlight, Stack, Text, Title} from "@mantine/core";


type HighlightsProps = {
    festivals?: number;
    extras?: Extra[];
    discounts?: CreateDiscountRequest[];
    selectedExtras: Extra[];
    setSelectedExtras: (extras: Extra[]) => void;
};

export default function Highlights({
                                       festivals,
                                       extras = [],
                                       discounts = [],
                                       selectedExtras,
                                       setSelectedExtras,
                                   }: HighlightsProps) {
    return (
        <Stack>
            {/* Festivals Section */}
            <Card shadow="sm" padding="lg">
                <Title order={3}>Festivals</Title>
                <Group mt="sm">
                    {festivals ? (
                        <Badge key={festivals}>...</Badge>
                    ) : (
                        <Text>No festivals...</Text>
                    )}
                </Group>
            </Card>

            {/* Extras Section */}
            <Card shadow="sm" padding="lg">
                <Title order={5} mt="md">
                    Extras
                </Title>
                {extras && extras.length > 0 ? (
                <Checkbox.Group
                    value={selectedExtras.map((e) => e.type)}
                    onChange={(types) => {
                        setSelectedExtras(
                            extras.filter((e) => types.includes(e.type))
                        );
                    }}
                >
                    {extras.map((extra) => (
                        <Checkbox
                            key={extra.type}
                            value={extra.type}
                            label={`${extra.type} (+€${extra.price.toFixed(2)}/night)`}
                        />
                    ))}
                </Checkbox.Group> ) : (
                    <Text>No available Extras.</Text>
                    )}
            </Card>


            {/* Available Discounts Section */}
            <Card shadow="sm" padding="lg">
                <Title order={3}>Available Discounts</Title>
                <Stack mt="sm">
                    {discounts && discounts.length > 0 ? (
                        discounts.map((discount, index) => (
                            <Text key={index}>
                                <Highlight highlight={discount.name}>
                                    {discount.name}
                                </Highlight>{" "}
                                – {discount.discountprocent}% (Expires on{" "}
                                {discount.expiringDate})
                            </Text>
                        ))
                    ) : (
                        <Text>No available discounts.</Text>
                    )}
                </Stack>
            </Card>
        </Stack>
    );
}