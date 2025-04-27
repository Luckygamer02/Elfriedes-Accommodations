"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import {
    Loader,
    Alert,
    Card,
    Text,
    Group,
    Title,
    Table,
    Stack,
    Button,
    Divider,
    Badge,
    Center,
} from "@mantine/core";
import { IconDownload, IconCalendar, IconBuildingFactory } from "@tabler/icons-react";
import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import httpClient from "@/lib/httpClient";
import { Booking } from "@/models/booking";

const fetcher = (url: string) => httpClient.get<Booking>(url).then((res) => res.data);

export default function BookingDetailsPage() {
    const { id } = useParams();
    const { data: booking, error, isLoading } = useSWR<Booking>(
        id ? `/api/bookings/${id}` : null,
        fetcher
    );

    if (isLoading) {
        return (
            <Center style={{ height: 200 }}>
                <Loader />
            </Center>
        );
    }
    if (error || !booking) {
        return (
            <Alert title="Error" color="red">
                Unable to load booking #{id}.
            </Alert>
        );
    }

    const handleDownloadPDF = () => {
        const doc = new jsPDF({ unit: "pt" });
        doc.setFontSize(16);
        doc.text(`Booking Details — #${booking.id}`, 40, 50);

        doc.setFontSize(12);
        let y = 80;
        const line = (label: string, val: string) => {
            doc.text(`${label}: ${val}`, 40, (y += 20));
        };

        line("Status", booking.status);
        line("Check-in", new Date(booking.checkInDate).toLocaleDateString());
        line(
            "Check-out",
            booking.checkOutDate
                ? new Date(booking.checkOutDate).toLocaleDateString()
                : "—"
        );
        line("Total price", `${booking.totalPrice.toFixed(2)} €`);
        doc.text("Accommodation:", 40, (y += 30));
        line(" • Title", booking.accommodation.title);
        line(" • Type", booking.accommodation.type);
        line(" • Address", [
            booking.accommodation.address.street,
            booking.accommodation.address.houseNumber,
            booking.accommodation.address.postalCode,
            booking.accommodation.address.city,
            booking.accommodation.address.country,
        ].join(", "));

        doc.save(`booking-${booking.id}.pdf`);
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group p="apart" mb="md">
                <Title order={2}>Booking #{booking.id}</Title>
                <Button
                    leftIcon={<IconDownload size={16} />}
                    onClick={handleDownloadPDF}
                >
                    Download PDF
                </Button>
            </Group>

            <Stack >
                <Group>
                    <IconCalendar />{" "}
                    <Text>
                        <strong>Check-in:</strong>{" "}
                        {new Date(booking.checkInDate).toLocaleDateString()}
                    </Text>
                    <Text>
                        <strong>Check-out:</strong>{" "}
                        {booking.checkOutDate
                            ? new Date(booking.checkOutDate).toLocaleDateString()
                            : "—"}
                    </Text>
                    <Badge color="blue">{booking.status}</Badge>
                </Group>

                <Divider label="Accommodation" />

                <Group  align="flex-start">
                    <IconBuildingFactory size={24} />
                    <Stack >
                        <Text w={500}>{booking.accommodation.title}</Text>
                        <Text size="sm">
                            {booking.accommodation.description}
                        </Text>
                        <Text size="sm">
                            {[
                                booking.accommodation.address.street,
                                booking.accommodation.address.houseNumber,
                                booking.accommodation.address.postalCode,
                                booking.accommodation.address.city,
                                booking.accommodation.address.country,
                            ].join(", ")}
                        </Text>
                    </Stack>
                </Group>

                {booking.bookedExtras.length > 0 && (
                    <>
                        <Divider label="Extras" />
                        <Table>
                            <thead>
                            <tr>
                                <th>Type</th>
                                <th>Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {booking.bookedExtras.map((e) => (
                                <tr key={e.type}>
                                    <td>{e.type}</td>
                                    <td>{e.price.toFixed(2)} €</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </>
                )}

                {booking.discounts.length > 0 && (
                    <>
                        <Divider label="Discounts" />
                        <Table withBorder>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>%</th>
                                <th>Applied on</th>
                            </tr>
                            </thead>
                            <tbody>
                            {booking.discounts.map((d, i) => (
                                <tr key={i}>
                                    <td>{d.discount.name}</td>
                                    <td>{d.discount.discountprocent}%</td>
                                    <td>
                                        {new Date(d.appliedDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </>
                )}

                <Divider label="Payment" />
                <Stack spacing={4}>
                    <Text>
                        <strong>Amount:</strong> {booking.payments.amount.toFixed(2)} €
                    </Text>
                    <Text>
                        <strong>Method:</strong> {booking.payments.method}
                    </Text>
                    <Text>
                        <strong>Paid on:</strong>{" "}
                        {new Date(booking.payments.paymentDate).toLocaleString()}
                    </Text>
                </Stack>

                <Divider label="QR Code" />
                <Center>
                    <QRCode
                        value={`${typeof window !== "undefined" ? window.location.href : ""}`}
                        size={128}
                    />
                </Center>
            </Stack>
        </Card>
    );
}
