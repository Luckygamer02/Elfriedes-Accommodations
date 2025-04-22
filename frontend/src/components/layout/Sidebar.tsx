import {Button, Group, NumberInput, Stack, Text, Title} from "@mantine/core";
import {DatePicker} from "@mantine/dates";

import {useState} from "react";
import {Accommodation} from "@/models/accommodation/accommodation";
import useSWR from "swr";
import {DateRange} from "@/models/booking";
import {restClient} from "@/lib/httpClient";
import {useRouter} from "next/navigation";

interface SidebarProps {
    accommodation: Accommodation;
}

export default function sidebar({ accommodation }: SidebarProps) {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [guests, setGuests] = useState(1);
    const router = useRouter();

    const totalPrice = () => {
        const [start, end] = dateRange;
        if (!start || !end) return 0;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * accommodation.basePrice * guests;
    };

    const { data: bookedDates = [] } = useSWR<DateRange[]>(
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
        const normEnd   = normalize(end);

        // For each existing booking...
        for (const range of bookedDates) {
            const from = normalize(new Date(range.from));
            const to   = normalize(new Date(range.to));

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
            guests: String(guests),
            total: String(totalPrice()),
        });

        // Push the full URL
        router.push(`/${accommodation.id}/details?${params.toString()}`);
    }



    return (
        <Stack>
            <Title order={3}>$ {accommodation.basePrice} night</Title>

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
                        const to   = normalize(new Date(range.to));
                        return normalized > from && normalized <= to;
                    });
                }}
            />

            <NumberInput
                label="Guests"
                value={guests}
                onChange={(value) => setGuests(typeof value === 'string' ? parseInt(value) || 1 : value)}
                min={1}
                max={accommodation.people}
            />

            <Group justify="space-between" mt="md">
                <Text size="lg">Total:</Text>
                <Text size="lg">${totalPrice()}</Text>
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