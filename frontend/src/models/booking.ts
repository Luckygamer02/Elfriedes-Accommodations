import {Accommodation, CreateAppliedDiscountRequest, Extra} from "./accommodation/accommodation";
import {AbstractEntity} from "@/models/backend";

export interface Payment {
    amount: number;
    method: PaymentMethod;
    paymentDate: string;       // ISO-8601
    last4?: string | null;     // e.g. last 4 CC digits
    expiry?: string | null;    // e.g. "04/25"
}

export interface Booking extends AbstractEntity {
    accommodation: Accommodation;
    checkInDate:  Date;                // e.g. "2025-04-26"
    checkOutDate: Date;         // can be null
    status:       BookingStatus;
    totalPrice:   number;
    bookedExtras: Extra[];               // re-use your Extra type
    payments:     Payment;
    appliedDiscounts: CreateAppliedDiscountRequest[];
}

export enum BookingStatus {
    PENDING    = "PENDING",
    CONFIRMED  = "CONFIRMED",
    CANCELLED  = "CANCELLED",
    COMPLETED  = "COMPLETED",
}

export enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    PAYPAL      = "PAYPAL",
    CASH        = "CASH",
    // …etc
}

export interface DateRange {
    from: Date,
    to: Date,
}