
import { CreateDiscountRequest, CreateExtraRequest,} from "@/models/accommodation/accommodation";
import {Badge, Card, Group,Highlight, Stack,Text,  Title} from "@mantine/core";

type HighlightsProps = {
    festivals?: number;
    extras?: CreateExtraRequest[];
    discounts?: CreateDiscountRequest[];
};


export default function Highlights({ festivals, extras, discounts }: HighlightsProps){
    return(
        <Stack>
            {/* Festivals Section */}
            <Card shadow="sm" padding="lg">
                <Title order={3}>Festivals</Title>
                <Group  mt="sm">
                    {festivals ? (
                        <Badge key={festivals}>...</Badge>
                    ) : (
                        <Text>No festivals...</Text>
                    )}
                </Group>
            </Card>

            {/* Extras Section */}
            <Card shadow="sm" padding="lg">
                <Title order={3}>Extras</Title>
                <Stack mt="sm">
                    {extras && extras.length > 0 ? (
                        extras.map((extra, index) => (
                            <Text key={index}>
                                <Highlight highlight={extra.type}>{extra.type}</Highlight> – €
                                {extra.price.toFixed(2)}
                            </Text>
                        ))
                    ) : (
                        <Text>No extras added.</Text>
                    )}
                </Stack>
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