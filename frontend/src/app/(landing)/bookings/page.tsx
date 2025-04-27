"use client"
import { useAuthGuard } from "@/lib/auth/use-auth";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Table, Loader, Alert, Card, ScrollArea, Text, Group } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import httpClient from "@/lib/httpClient";
import {Booking} from "@/models/booking";

const fetcher = (url : string) => httpClient.get(url).then(res => res.data);

export default function BookingsOverviewPage() {
    const router = useRouter();
    const { user } =  useAuthGuard({ middleware: "auth" });
    const { data: bookings, error, isLoading } = useSWR<Booking[]>(
        () => user?.id != null
            ? `/api/bookings/user/${user.id}`
            : null,
        fetcher
    );

    if (isLoading) return <Loader />;
    if (error) return (
        <Alert title="Error" color="red">
            Failed to load bookings.
        </Alert>
    );

    // no bookings returned yet (empty array)
    if (bookings && bookings.length === 0) {
        return (
            <Card shadow="sm" padding="lg" radius="md">
                <Text w={500} size="xl" mb="md">
                    My Bookings
                </Text>
                <Text color="dimmed">No bookings yet.</Text>
            </Card>
        );
    }

    // guard if bookings is still undefined for some reason
    if (!bookings) return null;
    const rows = bookings.map((booking) => (
        <tr
            key={booking.id}
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/bookings/${booking.id}`)}
        >
            <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>{booking.id}</td>
            <td style={{ textAlign: "center" }}>
                {booking.checkInDate
                    ? new Date(booking.checkInDate).toLocaleDateString()
                    : "—"}
            </td>
            <td style={{ textAlign: "center" }}>
                {booking.checkOutDate
                    ? new Date(booking.checkOutDate).toLocaleDateString()
                    : "—"}
            </td>
            <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                <Group p="apart" >
                    <Text>{booking.status}</Text>
                    <IconChevronRight size={18} />
                </Group>
            </td>
        </tr>
    ));

    return (
        <Card shadow="sm" padding="lg" radius="md">
            <Text w={500} size="xl" mb="md">
                My Bookings
            </Text>

            <ScrollArea>
                <Table
                    striped
                    highlightOnHover
                    horizontalSpacing="lg"
                    verticalSpacing="md"

                >
                    <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>ID</th>
                        <th style={{ textAlign: "center" }}>Start Date</th>
                        <th style={{ textAlign: "center" }}>End Date</th>
                        <th style={{ textAlign: "right" }}>Status</th>
                    </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </ScrollArea>
        </Card>
    );
}