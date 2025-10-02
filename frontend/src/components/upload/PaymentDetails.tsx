// components/PaymentDetails.tsx
"use client";
import {Group, Paper, Stack, TextInput, Title} from '@mantine/core';
import {IconCreditCard, IconTransfer, IconBrandPaypal} from '@tabler/icons-react';
import {
    PayPalScriptProvider,
    PayPalButtons,
    ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import {ReactNode, useMemo} from 'react';
import QRCode from 'react-qr-code';
import {showNotification} from "@mantine/notifications";
interface PaymentDetailsProps {
    paymentMethod: string;
    onCardDetailsChange: (field: string, value: string) => void;
    onBankDetailsChange: (field: string, value: string) => void;
    onPaypalApproval: (details: Record<string, unknown>) => void;
    cardDetails: {
        number: string;
        expiry: string;
        cvv: string;
        name: string;
    };
    bankDetails: {
        bic: string;
        name: string;
        iban:string;
    };
    amount: string;
}

export function PaymentDetails({
                                   paymentMethod,
                                   onCardDetailsChange,
                                   onBankDetailsChange,
                                   cardDetails,
                                   bankDetails,
                                    onPaypalApproval,
                                    amount
                               }: PaymentDetailsProps) {
    const paypalOptions: ReactPayPalScriptOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, // must be present
        currency: "EUR",
        intent: "capture",
        components: "buttons",
    };

    const epcPayload = useMemo(() => {
    // Build EPC QR payload according to EPC069-12 V3.1:
        const lines = [
            'BCD',                                // Service tag (fixed)
            '002',                                // Version: only EEA
            '1',                                  // Charset: UTF-8
            'SCT',                                // SEPA Credit Transfer
            'GENODEF1ZZZ',                        // BIC
            'Elfriedes Accommodation GmbH',       // Beneficiary name
            'AT611904300234573201',               // IBAN
            `EUR${amount}`,                           // Amount prefixed with “EUR”
            '',                                   // Purpose (max 4 chars) – left empty
            'Booking #0001/2025',                 // Unstructured remittance information
            ''                                    // Structured remittance information – left empty
        ].join('\r\n');
           // Join with CRLF; spec allows LF or CRLF but requires consistency :contentReference[oaicite:9]{index=9}
            return lines;
    }, [amount]);


    const renderPaymentContent = (): ReactNode => {
        switch (paymentMethod) {
            case 'CREDIT_CARD':
                return (
                    <>
                        <Title order={4} mb="sm" className="flex items-center gap-2">
                            <IconCreditCard size={20}/>
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

            case 'PAYPAL':
                return (
                    <PayPalScriptProvider options={paypalOptions}>
                        <Stack gap="md">
                            <Title order={4} className="flex items-center gap-2">
                                <IconBrandPaypal size={20} color="#003087" />
                                PayPal Payment
                            </Title>
                            <PayPalButtons
                                style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                             createOrder={(data, actions) => {
                               // now includes intent
                                   return actions.order.create({
                                     intent: "CAPTURE",
                                     purchase_units: [
                                       {
                                         amount: { value: amount, currency_code: "EUR" }
                                   }
                                 ]
                               });
                             }}
                             onApprove={async (data, actions) => {
                               // remove optional chaining so TS knows this always returns a Promise
                                 const details = await actions.order.capture();
                               onPaypalApproval(details);
                               showNotification({ title: "Success", message: "Payment received!", color: "green" });
                               //router.push("/booking");
                             }}
                            />
                            <p className="text-sm text-gray-600">You’ll be redirected to PayPal to complete payment.</p>
                        </Stack>
                    </PayPalScriptProvider>
                );
            case 'BANK_TRANSFER':
                return(
                    <Stack gap="md">
                        <Title order={4} className="flex items-center gap-2">
                            <IconTransfer size={20}/> Bank Transfer
                        </Title>
                        <Stack gap="sm">
                            <TextInput
                                label="Beneficiary BIC"
                                value={bankDetails.bic}
                                onChange={(e) => onBankDetailsChange('bic', e.target.value)}
                                required
                            />
                            <TextInput
                                label="Beneficiary Name"
                                value={bankDetails.name}
                                onChange={(e) => onBankDetailsChange('name', e.target.value)}
                                required
                            />
                            <TextInput
                                label="IBAN"
                                value={bankDetails.iban}
                                onChange={(e) => onBankDetailsChange('iban', e.target.value)}
                                required
                            />
                        </Stack>
                        <Title order={4}>
                            Or Pay with QR Code
                        </Title>
                        {/* EPC QR code */}
                        <div className="qr-code">
                            <QRCode value={epcPayload} size={160}/>
                        </div>
                    </Stack>
                );
            default:
                return null;
        }
    };

    return <Paper p="md" shadow="sm">{renderPaymentContent()}</Paper>;
}