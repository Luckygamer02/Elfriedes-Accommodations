import {z} from 'zod';

export const CreditCardSchema = z.object({
    number: z.string().min(12),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/), // MM/YY
    cvv: z.string().length(3),
    name: z.string().min(1),
});

export const BankTransferSchema = z.object({
    accountNumber: z.string().min(5),
    routingNumber: z.string().min(5),
});

export const BookingSchema = z.object({
    user: z.object({
        id: z.number().optional(),
        email: z.string().email(),
    }).nullable(),

    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),

    accommodationId: z.number(),
    checkInDate: z.string(), // ISO string
    checkOutDate: z.string(),
    status: z.enum(["CONFIRMED"]),
    people: z.number().positive(),
    totalPrice: z.number(),

    bookedExtras: z.array(z.any()), // ideally a proper schema here
    payments: z.object({
        method: z.enum(["CREDIT_CARD", "BANK_TRANSFER", "PAYPAL"]),
        amount: z.number(),
        transactionDate: z.string(),

        // Conditional fields
        last4: z.string().length(4).optional(),
        expiry: z.string().optional(),
        accountNumber: z.string().optional(),
        routingNumber: z.string().optional(),
    }),
    discounts: z.array(z.any()),
});


export const BookingParamsSchema = z.object({
    checkIn: z.string().transform(val => new Date(decodeURIComponent(val))),
    checkOut: z.string().transform(val => new Date(decodeURIComponent(val))),
    total: z.string().transform(Number),
    firstName: z.string().transform(decodeURIComponent),
    lastName: z.string().transform(decodeURIComponent),
    email: z.string().transform(val => decodeURIComponent(val)).pipe(z.string().email()),
    address: z.string().transform(decodeURIComponent),
    adults: z.string().transform(Number),
    children: z.string().transform(Number),
    infants: z.string().transform(Number),
});

export type ParsedBookingParams = z.infer<typeof BookingParamsSchema>;