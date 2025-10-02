// app/accommodations/[id]/contactdetails/page.tsx
"use client";
import {Button, Group, Paper, Stack, Text, TextInput, Title} from '@mantine/core';
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useAuthGuard} from "@/lib/auth/use-auth";
import Link from "next/link";
import {useState} from "react";

export default function ContactDetailsPage() {
    const {user} = useAuthGuard({middleware: "guest"});
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    // Get booking parameters
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const infants = searchParams.get('infants');
    const total = searchParams.get('total');

    // State for contact details
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');

    const [address, setAddress] = useState('');

    const handleProceedToBooking = () => {
        const query = new URLSearchParams({
            checkIn: checkIn || '',
            checkOut: checkOut || '',
            adults: adults || '',
            children: children || '',
            infants: infants || '',
            total: total || '',
            firstName: encodeURIComponent(firstName),
            lastName: encodeURIComponent(lastName),
            email: encodeURIComponent(email),
            address: encodeURIComponent(address)
        }).toString();

        router.push(`/${id}/book?${query}`);
    };

    if (!checkIn || !checkOut || !adults || !children || !infants  || !total) {
        return <Text>Invalid booking parameters</Text>;
    }

    return (
        <div className="contact-details-container">
            <Stack gap="xl" maw={600} mx="auto">
                <Title order={1}>Contact Details</Title>

                <Paper p="lg" shadow="sm" withBorder>
                    <Stack gap="md">
                        <Group grow>
                            <TextInput
                                label="First Name"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.currentTarget.value)}
                                readOnly={!!user}
                                placeholder="John"
                            />
                            <TextInput
                                label="Last Name"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.currentTarget.value)}
                                readOnly={!!user}
                                placeholder="Doe"
                            />
                        </Group>

                        <TextInput
                            label="Email"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            readOnly={!!user}
                            placeholder="your@email.com"
                        />

                        <TextInput
                            label="Billing Address"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.currentTarget.value)}
                            placeholder="Street, City, Postal Code"
                        />

                        <Button
                            fullWidth
                            size="lg"
                            mt="md"
                            onClick={handleProceedToBooking}
                            disabled={!user && (!firstName || !lastName || !email || !address)}
                        >
                            Proceed to Booking
                        </Button>
                    </Stack>
                </Paper>

                {!user && (
                    <Text c="dimmed" size="sm">
                        Already have an account?{' '}
                        <Link href="/login" style={{fontWeight: 500}}>
                            Log in here
                        </Link>
                    </Text>
                )}
            </Stack>
        </div>
    );
}