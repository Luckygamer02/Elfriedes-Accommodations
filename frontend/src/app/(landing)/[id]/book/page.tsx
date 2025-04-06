// app/accommodations/[id]/book/page.tsx
"use client";
import { Accommodation } from "@/models/accommidation/accommodation";
import { Text, Group, Stack, Title, Paper, Button, Radio, TextInput } from '@mantine/core';
import useSWR from "swr";
import httpClient from "@/lib/httpClient";
import Loading from "@/components/loading";
import { useParams, useSearchParams } from "next/navigation";
import { IconCalendar, IconUsers } from '@tabler/icons-react';
import { format } from 'date-fns';
import {useState} from "react";
import {useAuthGuard} from "@/lib/auth/use-auth";
import {PaymentDetails} from "@/components/PaymentDetails";

export default function BookingPage() {
    const {user} =  useAuthGuard({middleware: "guest"});
    const params = useParams();
    const searchParams = useSearchParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [paymentMethod, setPaymentMethod] = useState('creditCard');

    // Get booking details from URL params
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const total = searchParams.get('total');
    const handleCardChange = (field: string, value: string) => {
        setCardDetails(prev => ({ ...prev, [field]: value }));
    };


    // Neue States für Zahlungsdetails
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });
    const [bankDetails, setBankDetails] = useState({
        accountNumber: '',
        routingNumber: ''
    });

    const handleBankChange = (field: string, value: string) => {
        setBankDetails(prev => ({ ...prev, [field]: value }));
    };
    // Fetch accommodation details
    const { data: accommodation, error, isLoading } = useSWR<Accommodation>(
        `api/accommodations/${id}`,
        () => httpClient.get<Accommodation>(`api/accommodations/${id}`).then(res => res.data)
    );
    const [guestEmail, setGuestEmail] = useState('');
    const contactDetails = user ? {
        email: user.email,

    } : {
        email: guestEmail,
    };

    if (isLoading) return <Loading />;
    if (error) return <Text>Error loading booking details</Text>;
    if (!accommodation) return null;
    if (!checkIn || !checkOut || !guests || !total) {
        return <Text>Invalid booking parameters</Text>;
    }
    const isValidContact = user || (guestEmail);
    const renderContactDetails = () => {
        if (user) {
            return (
                <Stack gap="sm">
                    <TextInput
                        label="Email"
                        value={user.email}
                        readOnly
                    />
                </Stack>
            );
        }
        return (
            <Stack gap="sm">
                <TextInput
                    label="Email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.currentTarget.value)}
                    placeholder="Enter your email"
                />

            </Stack>
        );
    };

    // Parse dates
    const parsedDates = {
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null
    };

    const handleConfirmBooking = async () => {
        // Validate payment details based on method
        if (paymentMethod === 'creditCard' && (
            !cardDetails.number ||
            !cardDetails.expiry ||
            !cardDetails.cvv ||
            !cardDetails.name
        )) {
            alert('Bitte füllen Sie alle Kreditkartenfelder aus');
            return;
        }

        if (paymentMethod === 'bankTransfer' && (
            !bankDetails.accountNumber ||
            !bankDetails.routingNumber
        )) {
            alert('Bitte füllen Sie alle Bankverbindungsfelder aus');
            return;
        }

        // Validate contact details
        if (!isValidContact) {
            alert('Bitte geben Sie eine gültige E-Mail-Adresse an');
            return;
        }

        try {
            const bookingPayload = {
                user: {
                    id: user?.id, // Annahme: User-Objekt hat eine ID
                    email: user?.email || guestEmail
                },
                accommodationId: Number(id),
                checkInDate: format(parsedDates.checkIn!, 'yyyy-MM-dd'), // LocalDate
                checkOutDate: format(parsedDates.checkOut!, 'yyyy-MM-dd'), // LocalDate
                status: 'CONFIRMED', // Annahme: Enum-Wert
                totalPrice: total,
                bookedExtras: [], // Leer, falls keine Extras
                payments: [{
                    method: paymentMethod.toUpperCase(),
                    amount: total,
                    transactionDate: new Date().toISOString(),
                    details: paymentMethod === 'creditCard' ? {
                        last4: cardDetails.number.slice(-4),
                        expiry: cardDetails.expiry
                    } : {
                        accountNumber: bankDetails.accountNumber,
                        routingNumber: bankDetails.routingNumber
                    }
                }],
                appliedDiscounts: [] // Leer, falls keine Rabatte
            };

            const response = await httpClient.post('/api/bookings', bookingPayload);

            // Weiterleitung oder Erfolgsmeldung
            alert('Buchung erfolgreich!');
            // router.push('/bookings/' + response.data.id);

        } catch (error) {
            console.error('Fehler bei der Buchung:', error);
            alert('Ein Fehler ist bei der Buchung aufgetreten');
        }
    };
    return (
        <div className="booking-container">
            <Stack gap="xl">
                <Title order={1}>Confirm Your Booking</Title>
                <Radio.Group
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    name="paymentMethod"
                    label="Select payment method"
                >
                    <Stack mt="xs">
                        <Radio value="creditCard" label="Credit Card" />
                        <Radio value="paypal" label="PayPal" />
                        <Radio value="bankTransfer" label="Bank Transfer" />
                    </Stack>
                </Radio.Group>
                <PaymentDetails
                    paymentMethod={paymentMethod}
                    onCardDetailsChange={handleCardChange}
                    onBankDetailsChange={handleBankChange}
                    cardDetails={cardDetails}
                    bankDetails={bankDetails}
                />
                <Paper p="md" shadow="sm">
                    <Title order={4} mb="sm">Contact Details</Title>
                    {renderContactDetails()}
                </Paper>
                <Paper p="lg" shadow="sm" withBorder>
                    <Stack gap="md">
                        <Title order={2}>{accommodation.title}</Title>

                        <Group gap="xl">
                            <Group gap="sm">
                                <IconCalendar size={20} />
                                <Text>
                                    {parsedDates.checkIn && format(parsedDates.checkIn, 'MMM dd, yyyy')} -
                                    {parsedDates.checkOut && format(parsedDates.checkOut, 'MMM dd, yyyy')}
                                </Text>
                            </Group>

                            <Group gap="sm">
                                <IconUsers size={20} />
                                <Text>{guests} guests</Text>
                            </Group>
                        </Group>

                        <Group justify="space-between" mt="md">
                            <Text size="xl" fw={700}>Total:</Text>
                            <Text size="xl" fw={700}>${total}</Text>
                        </Group>

                        <Button
                            fullWidth
                            size="lg"
                            mt="md"
                            onClick={handleConfirmBooking}
                        >
                            Confirm Booking
                        </Button>
                    </Stack>
                </Paper>

                <Paper p="lg" shadow="sm" withBorder>
                    <Stack gap="md">
                        <Title order={3}>Accommodation Details</Title>
                        <Text>{accommodation.description}</Text>
                        <Text>Base Price: ${accommodation.basePrice}/night</Text>
                        <Text>Bedrooms: {accommodation.bedrooms}</Text>
                        <Text>Bathrooms: {accommodation.bathrooms}</Text>
                    </Stack>
                </Paper>
                <Paper p="md" shadow="sm">
                    <Title order={4} mb="sm">Cancellation Policy</Title>
                    <Text>
                        Free cancellation up to 24 hours before check-in.
                        Full refund if canceled at least 7 days before arrival.
                    </Text>
                </Paper>
            </Stack>
        </div>
    );
}