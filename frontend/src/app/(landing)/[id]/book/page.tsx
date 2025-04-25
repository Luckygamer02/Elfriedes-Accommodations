// app/accommodations/[id]/book/page.tsx
"use client";

import {useState} from "react";
import {useParams, useSearchParams} from "next/navigation";
import useSWR from "swr";
import {format} from "date-fns";
import {Button, Group, Paper, Radio, Stack, Text, Title} from "@mantine/core";
import {IconCalendar, IconUsers} from "@tabler/icons-react";

import Loading from "@/components/loading";
import httpClient from "@/lib/httpClient";
import {useAuthGuard} from "@/lib/auth/use-auth";
import {PaymentDetails} from "@/components/upload/PaymentDetails";
import {BankTransferSchema, BookingParamsSchema, CreditCardSchema} from "@/components/booking/validation";
import {Accommodation} from "@/models/accommodation/accommodation";

export default function BookingPage() {
    const {user} = useAuthGuard({middleware: "guest"});
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const searchParams = useSearchParams();
    const rawParams = Object.fromEntries(searchParams.entries());

    const result = BookingParamsSchema.safeParse(rawParams);
    if (!result.success) {
        return <Text>Invalid or missing booking parameters</Text>;
    }

    const {
        checkIn,
        checkOut,
        guests,
        total,
        firstName,
        lastName,
        email,
        address
    } = result.data;

    const parsedDates = {
        checkIn,
        checkOut
    };

    const [paymentMethod, setPaymentMethod] = useState("creditCard");

    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: "",
        name: ""
    });

    const [bankDetails, setBankDetails] = useState({
        accountNumber: "",
        routingNumber: ""
    });

    const handleCardChange = (field: string, value: string) => {
        setCardDetails((prev) => ({...prev, [field]: value}));
    };

    const handleBankChange = (field: string, value: string) => {
        setBankDetails((prev) => ({...prev, [field]: value}));
    };

    const {data: accommodation, error, isLoading} = useSWR<Accommodation>(
        `api/accommodations/${id}`,
        () => httpClient.get<Accommodation>(`api/accommodations/${id}`).then((res) => res.data)
    );

    if (isLoading) return <Loading/>;
    if (error) return <Text>Error loading booking details</Text>;
    if (!accommodation) return null;

    const isValidContact = !!(user || email);

    const handleConfirmBooking = async () => {
        if (!parsedDates.checkIn || !parsedDates.checkOut || !isValidContact) {
            alert("Invalid booking or contact details");
            return;
        }

        const basePayment = {
            method: paymentMethod.toUpperCase(),
            amount: total,
            transactionDate: new Date().toISOString(),
        };

        let payment: any = {...basePayment};

        if (paymentMethod === "creditCard") {
            const creditValidation = CreditCardSchema.safeParse(cardDetails);
            if (!creditValidation.success) {
                alert("Please fill in valid credit card details");
                return;
            }
            payment = {
                ...payment,
                last4: cardDetails.number.slice(-4),
                expiry: cardDetails.expiry,
            };
        } else if (paymentMethod === "bankTransfer") {
            const bankValidation = BankTransferSchema.safeParse(bankDetails);
            if (!bankValidation.success) {
                alert("Please provide valid bank transfer info");
                return;
            }
            payment = {
                ...payment,
                accountNumber: bankDetails.accountNumber,
                routingNumber: bankDetails.routingNumber,
            };
        }

        const bookingPayload = {
            user: user ? {id: user.id, email: user.email} : null,
            firstName,
            lastName,
            email: user?.email || email,
            accommodationId: Number(id),
            checkInDate: parsedDates.checkIn.toISOString(),
            checkOutDate: parsedDates.checkOut.toISOString(),
            status: "CONFIRMED",
            people: guests,
            totalPrice: total,
            bookedExtras: [],
            payments: payment,
            appliedDiscounts: [],
        };

        try {
            const response = await httpClient.post("/api/bookings", bookingPayload);
            alert("Booking successful!");
            // router.push('/bookings/' + response.data.id);
        } catch (error) {
            console.error("Booking error:", error);
            alert("Something went wrong with the booking");
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
                        <Radio value="creditCard" label="Credit Card"/>
                        <Radio value="paypal" label="PayPal"/>
                        <Radio value="bankTransfer" label="Bank Transfer"/>
                    </Stack>
                </Radio.Group>

                <PaymentDetails
                    paymentMethod={paymentMethod}
                    onCardDetailsChange={handleCardChange}
                    onBankDetailsChange={handleBankChange}
                    cardDetails={cardDetails}
                    bankDetails={bankDetails}
                />

                <Paper p="lg" shadow="sm" withBorder>
                    <Stack gap="md">
                        <Title order={2}>{accommodation.title}</Title>

                        <Group gap="xl">
                            <Group gap="sm">
                                <IconCalendar size={20}/>
                                <Text>
                                    {format(parsedDates.checkIn, "MMM dd, yyyy")} -{" "}
                                    {format(parsedDates.checkOut, "MMM dd, yyyy")}
                                </Text>
                            </Group>

                            <Group gap="sm">
                                <IconUsers size={20}/>
                                <Text>{guests} guests</Text>
                            </Group>
                        </Group>

                        <Group justify="space-between" mt="md">
                            <Text size="xl" fw={700}>
                                Total:
                            </Text>
                            <Text size="xl" fw={700}>
                                ${total}
                            </Text>
                        </Group>

                        <Button fullWidth size="lg" mt="md" onClick={handleConfirmBooking}>
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
                    <Title order={4} mb="sm">
                        Cancellation Policy
                    </Title>
                    <Text>
                        Free cancellation up to 24 hours before check-in. Full refund if
                        canceled at least 7 days before arrival.
                    </Text>
                </Paper>
            </Stack>
        </div>
    );
}
