// app/accommodation/manage/[id]/bookings/page.tsx
"use client";

import React from "react";
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
} from "@mantine/core";
import httpClient from "@/lib/httpClient";
import { Booking } from "@/models/booking";

const fetcher = (url: string) =>
    httpClient.get<Booking[]>(url).then((r) => r.data);

export default function AccommodationBookingsPage() {
    const params = useParams();          // { id: string }
    const router = useRouter();
    const accid = params.id;

    const { data: bookings, error, isLoading } = useSWR<Booking[]>(
        accid ? `/api/bookings/accomodation/${accid}` : null,
        fetcher
    );

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
                <Text color="dimmed">No bookings yet.</Text>
            </Card>
        );

    return (
        <Card shadow="sm" p="lg" radius="md">
            <Text w={500} size="xl" mb="md">
                Bookings for Accommodation {accid}
            </Text>
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
