import {AbstractEntity, MultipartFile, User} from "@/models/backend";

export enum AccommodationType {
    FLAT = 'FLAT',
    HOUSE = 'HOUSE',
    ROOM = 'ROOM',
    UNIQUE = 'UNIQUE',
}

export enum Extrastype {
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


export interface Address {
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
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

export interface CreateDiscountRequest {
    discountprocent: number;
    name: string;
    expiringDate: string;
}

export interface CreateAppliedDiscountRequest {
    discount: CreateDiscountRequest;
    appliedDate: string;
}

export interface Extra {
    type: Extrastype;
    price: number;
}

export interface CreateAccommodationRequest {
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
    address: Address;
    features: AccommodationFeatures;
    appliedDiscounts: CreateAppliedDiscountRequest[];
    extras: Extra[];
    pictures: MultipartFile[];
}


export interface Accommodation extends AbstractEntity {
    title: string,
    description: string,
    basePrice: number,
    bedrooms: number,
    bathrooms: number,
    people: number,
    livingRooms: number,
    type: AccommodationType,
    festivalistId: number,
    ownerId: number,
    address: Address,
    features: AccommodationFeatures,
    appliedDiscounts: CreateAppliedDiscountRequest[],
    extras: Extra[],
    picturesurls: string[]
}


export interface Rating {
    id: string;
    comment: string;
    rating: number;
    User: User;
    createdOn: string;
}