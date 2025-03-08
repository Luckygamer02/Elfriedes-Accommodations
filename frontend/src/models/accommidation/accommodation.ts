import {AbstractEntity} from "@/models/backend";

export default interface Accommodation extends AbstractEntity,Adress,Extras {
    title: string;
    description: string;
    price: number;
    userid: string;
    images: File[];
    pricedExtras: String[];
}

export interface Extras{
    wifi: boolean;
    garden: boolean;
    tv: boolean;
    pool: boolean;
    kitchen: boolean;
    washingmaschine: boolean;
    ac: boolean;
    microwave: boolean;
}
export interface Adress{
    street: string;
    city: string;
    state: string;
    zip: string;
}