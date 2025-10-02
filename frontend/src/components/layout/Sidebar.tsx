import {Button, Checkbox, Group, NumberInput, Stack, Text, Title} from "@mantine/core";

import {DatePicker} from "@mantine/dates";
import '@mantine/dates/styles.css';
import {useState} from "react";
import {Accommodation, Extra} from "@/models/accommodation/accommodation";
import useSWR from "swr";
import {DateRange} from "@/models/booking";
import {restClient} from "@/lib/httpClient";
import {useRouter} from "next/navigation";

interface SidebarProps {
    accommodation: Accommodation;
    selectedExtras: Extra[];
    setSelectedExtras: (extras: Extra[]) => void;
}

export default function Sidebar({accommodation, selectedExtras, setSelectedExtras } : SidebarProps) {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const router = useRouter();
    // track which extras are checked

    const totalPrice = () => {
        const [start, end] = dateRange;
        if (!start || !end) return 0;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const today = new Date();
        const multiplier = accommodation.discounts
            ?.filter(({ expiringDate }) => new Date(expiringDate) > today)
            .reduce(
                (acc, { discountprocent }) => acc * (1 - discountprocent / 100),
                1
            ) ?? 1;
        const extrasCosts = selectedExtras.reduce(
            (sum, e) => sum + e.price,
            0
        );

        const perAdult    = accommodation.basePrice;
        const perChild    = accommodation.basePrice * 0.8;
        const perInfant   = 0;

        return nights * multiplier * (adults * perAdult + children * perChild + infants * perInfant) + extrasCosts;
    };

    const {data: bookedDates = []} = useSWR<DateRange[]>(
        `api/bookings/bookeddates/${accommodation.id}`,
        () => restClient.getBookedDatesforAcc(accommodation.id)
    );

    function normalize(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function isValidRange(): boolean {
        const [start, end] = dateRange;
        if (!start || !end) return false;

        const normStart = normalize(start);
        const normEnd = normalize(end);

        // For each existing booking...
        for (const range of bookedDates) {
            const from = normalize(new Date(range.from));
            const to = normalize(new Date(range.to));

            // Overlap occurs iff:
            //   your start is before their checkout (normStart < to) AND
            //   your end is after their check‑in  (normEnd   > from)
            //
            // Notice that if normEnd === from, then normEnd > from is false → NO overlap.
            if (normStart < to && normEnd > from) {
                return false;
            }
        }

        return true;
    }

    function handleBooking() {
        if (!dateRange[0] || !dateRange[1]) return;
        if (!isValidRange()) {
            alert("Selected date range includes unavailable dates.");
            return;
        }

        // Build a query string
        const params = new URLSearchParams({
            checkIn: dateRange[0].toISOString(),
            checkOut: dateRange[1].toISOString(),
            adults: adults.toString(),
            children: children.toString(),
            infants: infants.toString(),
            total: totalPrice().toFixed(2),
        });

        // Push the full URL
        router.push(`/${accommodation.id}/details?${params.toString()}`);
    }

    // @ts-expect-error - MathML content requires dangerouslySetInnerHTML
    return (
        <Stack>
            <Title order={3}>€ {accommodation.basePrice} / night</Title>
            <DatePicker
                type="range"
                value={dateRange}
                onChange={setDateRange}
                minDate={new Date()}
                numberOfColumns={1}
                allowSingleDateInRange
                excludeDate={(date) => {
                    const normalized = normalize(date);
                    const today = normalize(new Date());


                    // disable if it’s before today
                    if (normalized < today) {
                        return true;
                    }


                    // or if it falls into any booked range
                    return bookedDates.some((range) => {
                        const from = normalize(new Date(range.from));
                        const to = normalize(new Date(range.to));
                        return normalized > from && normalized <= to;
                    });
                }}
            />

            {/* MathML formula */}
            <div>
                <Title order={5} mb="xs">Pricing formula:</Title>
                <div
                    dangerouslySetInnerHTML={{
                        __html: `
                    <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
                         <mtable>
                            <mtr>
                              <mtd>
                                <mrow>
                                  <mi>Total</mi>
                                  <mo>=</mo>
                                  <mi>nights</mi>
                                  <mo>×</mo>
                                  <mi>BasePrice</mi>
                                  <mo>×</mo>
                                  <mi>discounts</mi>
                                  <mo>×</mo>
                                </mrow>
                              </mtd>
                            </mtr>
                            <mtr>
                              <mtd>
                                <mrow>
                                  <mo stretchy="false">(</mo>
                                  <mi>adults</mi>
                                  <mo>+</mo>
                                  <mn>0.8</mn>
                                  <mo>×</mo>
                                  <mi>children</mi>
                                  <mo>+</mo>
                                  <mn>0</mn>
                                  <mo>×</mo>
                                  <mi>infants</mi>
                                  <mo stretchy="false">)</mo>
                                  <mo>+</mo>
                                  <mi>extras</mi>
                                </mrow>
                              </mtd>
                            </mtr>
                          </mtable>
                    </math>`,
                  }}
                />
            </div>
            <Title order={5} mt="md">
                Extras
            </Title>
            <Checkbox.Group
                value={selectedExtras.map((e) => e.type)}
                onChange={(types) => {
                    setSelectedExtras(
                        accommodation.extras.filter((e) => types.includes(e.type))
                    );
                }}
            >
                {accommodation.extras.map((extra) => (
                    <Checkbox
                        key={extra.type}
                        value={extra.type}
                        label={`${extra.type} (+€${extra.price.toFixed(2)}/night)`}
                    />
                ))}
            </Checkbox.Group>

            <NumberInput
                label="Adults"
                value={adults}
                onChange={(value) => setAdults(typeof value === 'string' ? parseInt(value) || 1 : value)}
                min={1}
                max={accommodation.people - children - infants}
            />
            <NumberInput
                label="Children"
                value={children}
                onChange={(value) => setChildren(typeof value === 'string' ? parseInt(value) || 1 : value)}
                min={1}
                max={accommodation.people - adults - infants }
            />
            <NumberInput
                label="Infants"
                value={infants}
                onChange={(value) => setInfants(typeof value === 'string' ? parseInt(value) || 1 : value)}
                min={1}
                max={accommodation.people - children - adults }
            />

            <Group justify="space-between" mt="md">
                <Text size="lg">Total:</Text>
                <Text size="lg">€{totalPrice().toFixed(2)}</Text>
            </Group>

            <Button
                fullWidth
                size="lg"
                mt="md"
                onClick={handleBooking}
                disabled={!dateRange[0] || !dateRange[1]}
            >
                Book Now
            </Button>
        </Stack>
    );
}