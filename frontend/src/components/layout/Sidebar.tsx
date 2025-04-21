import {Button, Group, NumberInput, Stack, Text, Title} from "@mantine/core";
import {DatePicker} from "@mantine/dates";

import {useState} from "react";
import {Accommodation} from "@/models/accommodation/accommodation";
import useSWR from "swr";
import {DateRange} from "@/models/booking";
import {restClient} from "@/lib/httpClient";
import {router} from "next/client";

interface SidebarProps {
    accommodation: Accommodation;
}

export default function sidebar({ accommodation }: SidebarProps) {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [guests, setGuests] = useState(1);

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

        // Check if any selected date overlaps with booked ranges
        for (
            let d = new Date(start);
            d <= end;
            d.setDate(d.getDate() + 1)
        ) {
            const day = normalize(new Date(d)); // copy the date
            if (
                bookedDates.some(
                    (range) =>
                        day >= normalize(new Date(range.from)) &&
                        day <= normalize(new Date(range.to))
                )
            ) {
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

        router.push({
            pathname: `/${accommodation.id}/details`,
            query: {
                checkIn: dateRange[0].toISOString(),
                checkOut: dateRange[1].toISOString(),
                guests: guests,
                total: totalPrice()
            }
        });
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
                excludeDate={(date) =>
                    normalize(date) < normalize(new Date()) ||
                    bookedDates.some(
                        (range) =>
                            normalize(date) >= normalize(new Date(range.from)) &&
                            normalize(date) <= normalize(new Date(range.to))
                    )
                }
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