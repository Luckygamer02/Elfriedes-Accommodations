// app/accommodation/manage/[id]/bookings/page.tsx
"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import {
    Table,
    ScrollArea,
    Card,
    Text,
    Loader,
    Alert,
    Badge,
    Paper,
    Grid,
    Group,
    RingProgress, Stack,
} from "@mantine/core";
import httpClient from "@/lib/httpClient";
import { Booking, BookingStatus } from "@/models/booking";

const fetcher = (url: string) =>
    httpClient.get<Booking[]>(url).then((r) => r.data);

export default function AccommodationBookingsPage() {
    const params = useParams();          // { id: string }
    const accid = params.id;

    const { data: bookings, error, isLoading } = useSWR<Booking[]>(
        accid ? `/api/bookings/accomodation/${accid}` : null,
        fetcher
    );
    // Calculate statistics
    const statistics = useMemo(() => {
        if (!bookings || bookings.length === 0) return null;

        // Total number of bookings
        const totalBookings = bookings.length;

        // Total revenue
        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

        // Average booking duration
        const durationData = bookings
            .filter(b => b.checkOutDate) // Only consider bookings with checkout dates
            .map(b => {
                const checkIn = new Date(b.checkInDate);
                const checkOut = new Date(b.checkOutDate);
                const days = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                return days > 0 ? days : 0;
            });

        const avgDuration = durationData.length > 0
            ? durationData.reduce((sum, days) => sum + days, 0) / durationData.length
            : 0;

        // Status distribution
        const statusCounts = {
            [BookingStatus.CONFIRMED]: 0,
            [BookingStatus.PENDING]: 0,
            [BookingStatus.CANCELLED]: 0,
            [BookingStatus.COMPLETED]: 0,
        };

        bookings.forEach(b => {
            statusCounts[b.status]++;
        });

        const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
            percentage: (count / totalBookings) * 100,
        }));

        // Current month revenue
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonthRevenue = bookings
            .filter(b => {
                const bookingDate = new Date(b.checkInDate);
                return bookingDate.getMonth() === currentMonth &&
                    bookingDate.getFullYear() === currentYear;
            })
            .reduce((sum, b) => sum + b.totalPrice, 0);

        return {
            totalBookings,
            totalRevenue,
            avgDuration,
            statusDistribution,
            currentMonthRevenue,
        };
    }, [bookings]);
    if (isLoading) return <Loader />;
    if (error)
        return (
            <Alert title="Error" color="red">
                Failed to load bookings.
            </Alert>
        );
    if (bookings && bookings.length === 0)
        return (
            <Card shadow="sm" p="lg" radius="md">
                <Text w={500} size="xl" mb="md">
                    Bookings for Accommodation {accid}
                </Text>
                <Text c="dimmed">No bookings yet.</Text>
            </Card>
        );

    // Status color mapping
    const statusColors = {
        [BookingStatus.CONFIRMED]: "green",
        [BookingStatus.PENDING]: "yellow",
        [BookingStatus.CANCELLED]: "red",
        [BookingStatus.COMPLETED]: "blue",
    };

    // Prepare data for ring progress
    const ringProgressData = statistics?.statusDistribution.map(item => ({
        value: item.percentage,
        color: statusColors[item.status as BookingStatus],
        tooltip: `${item.status}: ${item.count} (${item.percentage.toFixed(1)}%)`,
    }));


    return (
        <Card shadow="sm" p="lg" radius="md">
            <Text w={500} size="xl" mb="md">
                Bookings for Accommodation {accid}
            </Text>
            {statistics && (
                <Paper withBorder p="md" radius="md" mb="xl">
                    <Text size="lg" w={500} mb="md">Booking Statistics</Text>

                    <Grid>
                        {/* Key metrics */}
                        <Grid.Col span={8}>
                            <Grid>
                                <Grid.Col span={6}>
                                    <Paper withBorder p="md" radius="md">
                                        <Text size="xs" w={700}>
                                            Total Bookings
                                        </Text>
                                        <Text size="xl" w={700} mt="xs">
                                            {statistics.totalBookings}
                                        </Text>
                                    </Paper>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Paper withBorder p="md" radius="md">
                                        <Text size="xs"   w={700}>
                                            Total Revenue
                                        </Text>
                                        <Text size="xl" w={700} mt="xs">
                                            €{statistics.totalRevenue.toFixed(2)}
                                        </Text>
                                    </Paper>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Paper withBorder p="md" radius="md">
                                        <Text size="xs" w={700}>
                                            Avg. Stay Duration
                                        </Text>
                                        <Text size="xl" w={700} mt="xs">
                                            {statistics.avgDuration.toFixed(1)} days
                                        </Text>
                                    </Paper>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Paper withBorder p="md" radius="md">
                                        <Text size="xs" w={700}>
                                            Current Month Revenue
                                        </Text>
                                        <Text size="xl" w={700} mt="xs">
                                            €{statistics.currentMonthRevenue.toFixed(2)}
                                        </Text>
                                    </Paper>
                                </Grid.Col>
                            </Grid>
                        </Grid.Col>

                        {/* Status Distribution Chart */}
                        <Grid.Col span={4}>
                            <Paper withBorder p="md" radius="md" h="100%">
                                <Text size="xs"  w={700} mb="md">
                                    Booking Status
                                </Text>
                                <Group >
                                    <RingProgress
                                        size={150}
                                        thickness={20}
                                        sections={ringProgressData || []}
                                        label={
                                            <Text size="xs" >
                                                Status Distribution
                                            </Text>
                                        }
                                    />
                                </Group>
                                <Stack mt="md">
                                    {statistics.statusDistribution.map((item) => (
                                        <Group key={item.status} >
                                            <Group >
                                                <div
                                                    style={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        backgroundColor: statusColors[item.status as BookingStatus],
                                                    }}
                                                />
                                                <Text size="xs">{item.status}</Text>
                                            </Group>
                                            <Text size="xs" w={500}>
                                                {item.count} ({item.percentage.toFixed(1)}%)
                                            </Text>
                                        </Group>
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid.Col>
                    </Grid>
                </Paper>
            )}
            <ScrollArea>
                <Table highlightOnHover verticalSpacing="md">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Total (€)</th>
                        <th>Status</th>
                        <th>Payment</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings!.map((b) => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>
                                {new Date(b.checkInDate).toLocaleDateString()}
                            </td>
                            <td>
                                {b.checkOutDate
                                    ? new Date(b.checkOutDate).toLocaleDateString()
                                    : "-"}
                            </td>
                            <td>€{b.totalPrice.toFixed(2)}</td>
                            <td>
                                <Badge
                                    color={
                                        b.status === "CONFIRMED"
                                            ? "green"
                                            : b.status === "PENDING"
                                                ? "yellow"
                                                : b.status === "CANCELLED"
                                                    ? "red"
                                                    : "blue"
                                    }
                                >
                                    {b.status}
                                </Badge>
                            </td>
                            <td>
                                {b.payments.method} €{b.payments.amount.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </ScrollArea>
        </Card>
    );
}
