// components/PaymentDetails.tsx
"use client";
import { Paper, TextInput, Group, Title, Stack, Radio } from '@mantine/core';
import { IconCreditCard, IconTransfer } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface PaymentDetailsProps {
    paymentMethod: string;
    onCardDetailsChange: (field: string, value: string) => void;
    onBankDetailsChange: (field: string, value: string) => void;
    cardDetails: {
        number: string;
        expiry: string;
        cvv: string;
        name: string;
    };
    bankDetails: {
        accountNumber: string;
        routingNumber: string;
    };
}

export function PaymentDetails({
                                   paymentMethod,
                                   onCardDetailsChange,
                                   onBankDetailsChange,
                                   cardDetails,
                                   bankDetails
                               }: PaymentDetailsProps) {
    const renderPaymentContent = (): ReactNode => {
        switch (paymentMethod) {
            case 'creditCard':
                return (
                    <>
                        <Title order={4} mb="sm" className="flex items-center gap-2">
                            <IconCreditCard size={20} />
                            Credit Card Details
                        </Title>
                        <Stack gap="sm">
                            <TextInput
                                label="Card Number"
                                placeholder="1234 5678 9012 3456"
                                required
                                value={cardDetails.number}
                                onChange={(e) => onCardDetailsChange('number', e.target.value)}
                            />
                            <Group grow>
                                <TextInput
                                    label="Expiration Date"
                                    placeholder="MM/YY"
                                    required
                                    value={cardDetails.expiry}
                                    onChange={(e) => onCardDetailsChange('expiry', e.target.value)}
                                />
                                <TextInput
                                    label="CVV"
                                    placeholder="123"
                                    required
                                    value={cardDetails.cvv}
                                    onChange={(e) => onCardDetailsChange('cvv', e.target.value)}
                                />
                            </Group>
                            <TextInput
                                label="Cardholder Name"
                                placeholder="John Doe"
                                required
                                value={cardDetails.name}
                                onChange={(e) => onCardDetailsChange('name', e.target.value)}
                            />
                        </Stack>
                    </>
                );

            case 'bankTransfer':
                return (
                    <>
                        <Title order={4} mb="sm" className="flex items-center gap-2">
                            <IconTransfer size={20} />
                            Bank Transfer Details
                        </Title>
                        <Stack gap="sm">
                            <TextInput
                                label="Account Number"
                                placeholder="123456789"
                                required
                                value={bankDetails.accountNumber}
                                onChange={(e) => onBankDetailsChange('accountNumber', e.target.value)}
                            />
                            <TextInput
                                label="Routing Number"
                                placeholder="082000549"
                                required
                                value={bankDetails.routingNumber}
                                onChange={(e) => onBankDetailsChange('routingNumber', e.target.value)}
                            />
                        </Stack>
                    </>
                );

            default:
                return null;
        }
    };

    return <Paper p="md" shadow="sm">{renderPaymentContent()}</Paper>;
}