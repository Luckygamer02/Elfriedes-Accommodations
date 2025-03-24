import {AbstractEntity} from "@/models/backend";

enum AccommodationType {
    FLAT= 'FLAT',
    HOUSE = 'HOUSE',
    ROOM = 'ROOM',
    UNIQUE = 'UNIQUE'
}

enum Extrastype {
    CLEANING = 'CLEANING',
    BREAKFAST = 'BREAKFAST',
    PARKING = 'PARKING',
    SPA_ACCESS = 'SPA_ACCESS',
    GYM_ACCESS = 'GYM_ACCESS',
    LATE_CHECKOUT = 'LATE_CHECKOUT',
    EARLY_CHECKIN = 'EARLY_CHECKIN',
    ROOM_SERVICE = 'ROOM_SERVICE',
    AIRPORT_SHUTTLE = 'AIRPORT_SHUTTLE',
    PET_FRIENDLY = 'PET_FRIENDLY',
    MINIBAR = 'MINIBAR',
    EXTRA_BED = 'EXTRA_BED',
    LAUNDRY_SERVICE = 'LAUNDRY_SERVICE',
    CITY_TOUR = 'CITY_TOUR',
    CONCIERGE_SERVICE = 'CONCIERGE_SERVICE',

}

interface CreateAddressRequest {
    street: string;
    houseNumber: string;
    city: string;
    zipCode: string;
    country: string;
}

interface CreateAccommodationFeatureRequest {
    ac: boolean;
    garden: boolean;
    kitchen: boolean;
    microwave: boolean;
    meetingTable: boolean;
    pool: boolean;
    tv: boolean;
    washingMachine: boolean;
    wifi: boolean;
}

interface CreateDiscountRequest {
    discountprocent: number;
    name: string;
    expioringdate: string; // Use string or Date type based on your date handling
}

interface CreateAppliedDiscountRequest {
    discount: CreateDiscountRequest;
    appliedDate: string; // Use string or Date type based on your date handling
}

interface CreateExtraRequest {
    type: Extrastype;
    price: number;
}

interface CreateAccommodationRequest {
    title: string;
    description: string;
    basePrice: number;
    bedrooms: number;
    bathrooms: number;
    people: number;
    livingRooms: number;
    type: AccommodationType;
    festivalistId: number;
    ownerId: number;
    address: CreateAddressRequest;
    features: CreateAccommodationFeatureRequest;
    appliedDiscounts: CreateAppliedDiscountRequest[];
    extras: CreateExtraRequest[];
}


interface Accommodation extends AbstractEntity {
    title: string;
    description: string;
    price: number;
    userid: string;
    images: File[];
    pricedExtras: string[];
    address: Address;
    features: AccommodationFeatures;
}

interface Address {
    street: string;
    houseNumber: string;
    city: string;
    zipCode: string;
    country: string;
}

interface AccommodationFeatures {
    ac: boolean;
    garden: boolean;
    kitchen: boolean;
    microwave: boolean;
    meetingTable: boolean;
    pool: boolean;
    tv: boolean;
    washingMachine: boolean;
    wifi: boolean;
}