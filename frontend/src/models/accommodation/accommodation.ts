import {AbstractEntity, MultipartFile, User} from "@/models/backend";

export enum AccommodationType {
    FLAT = 'FLAT',
    HOUSE = 'HOUSE',
    ROOM = 'ROOM',
    UNIQUE = 'UNIQUE',
}

export enum Extratype {
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
export enum FestivalType {
    // Music genres
    ROCK = 'ROCK',
    POP = 'POP',
    JAZZ = 'JAZZ',
    ELECTRONIC = 'ELECTRONIC',
    FOLK = 'FOLK',
    HIP_HOP = 'HIP_HOP',
    CLASSICAL = 'CLASSICAL',
    WORLD = 'WORLD',

    // Arts & culture
    ARTS = 'ARTS',
    FILM = 'FILM',
    THEATER = 'THEATER',
    LITERATURE = 'LITERATURE',
    DANCE = 'DANCE',
    COMEDY = 'COMEDY',
    FASHION = 'FASHION',

    // Food & drink
    FOOD = 'FOOD',
    WINE = 'WINE',
    BEER = 'BEER',
    STREET_FOOD = 'STREET_FOOD',
    CHOCOLATE = 'CHOCOLATE',

    // Cultural & community
    CULTURAL = 'CULTURAL',
    RELIGIOUS = 'RELIGIOUS',
    PRIDE = 'PRIDE',
    CARNIVAL = 'CARNIVAL',
    PARADE = 'PARADE',

    // Seasonal & outdoors
    SPRING = 'SPRING',
    SUMMER = 'SUMMER',
    AUTUMN = 'AUTUMN',
    WINTER = 'WINTER',
    FLOWER = 'FLOWER',
    LIGHT = 'LIGHT',
    FOOD_TRUCK = 'FOOD_TRUCK',

    // Specialized / niche
    TECHNOLOGY = 'TECHNOLOGY',
    SCIENCE = 'SCIENCE',
    GAMING = 'GAMING',
    WELLNESS = 'WELLNESS',
    ENVIRONMENT = 'ENVIRONMENT',
    FAMILY = 'FAMILY',
    SPORTS = 'SPORTS',
    MOTOR = 'MOTOR',
}

export interface Festival{
    id: number,
    name: string,
    startDate: string,
    endDate: string,
    festivalType: FestivalType
}

export interface Address {
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
    country: string;
}


export interface AccommodationFeatures {
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
    startDate: string;
    expiringDate: string;
}


export interface Extra {
    type: Extratype;
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
    festivalistId?: number;
    ownerId: number;
    address: Address;
    features: AccommodationFeatures;
    discounts: CreateDiscountRequest[];
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
    discounts: CreateDiscountRequest[],
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

