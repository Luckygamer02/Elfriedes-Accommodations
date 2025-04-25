"use client"
import AccommodationMap from "@/components/Map/AccommodationMap";
import {restClient} from "@/lib/httpClient";
import {useSearchParams} from "next/navigation";
import {Accommodation, AccommodationType, Extrastype} from "@/models/accommodation/accommodation";
import SearchSideBar from "@/components/Searchbar/SearchSideBar";
import AccommodationRaster from "@/components/layout/AccommodationRaster";
import useSWR from "swr";

export default function SearchPage() {

    const searchParams = useSearchParams();
    // 1. Lese Roh-Parameter aus URL
    const cityParam = searchParams.get("city");
    const typeParam = searchParams.get("type") as AccommodationType | null;
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const extrasParam = searchParams.getAll("extras") as Extrastype[];
    const roomsParam = searchParams.get("rooms");
    const bedroomsParam = searchParams.get("bedrooms");
    const bathroomsParam = searchParams.get("bathrooms");
    const peopleParam = searchParams.get("people");
    const postalCodeParam = searchParams.get("postalCode");
    const festivalistParam = searchParams.get("festivalist");
    const featuresParam = searchParams.getAll(
        "features"
    ) as (keyof Accommodation["features"])[];

    // 2. Baue daraus nur die tatsächlich gesetzten Filter
    const filters = {
        city: cityParam || undefined,
        postalCode: postalCodeParam || undefined,
        minPrice: minPriceParam ? Number(minPriceParam) : undefined,
        maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
        bedrooms: bedroomsParam ? Number(bedroomsParam) : undefined,
        bathrooms: bathroomsParam ? Number(bathroomsParam) : undefined,
        people: peopleParam ? Number(peopleParam) : undefined,
        livingRooms: roomsParam ? Number(roomsParam) : undefined,
        type: typeParam || undefined,
        festivalistId: festivalistParam ? Number(festivalistParam) : undefined,
        extras: extrasParam,
        features: featuresParam,
    };

    const queryKey = ['accommodations', filters];
    const {data, error, isLoading} = useSWR(
        queryKey,
        () => restClient.getAccommodationbySearchParams(filters).then(res => res),
    );
    if (!data) return (
        <div>Loading...</div>
    )
    const accommodationAddresses: string[] = data
        .map(data => data.address)
        .filter(addr => addr != null)
        .map(addr => String(addr));


    return (
        <>
            <SearchSideBar/>
            <AccommodationMap addressList={accommodationAddresses}/>
            <AccommodationRaster accommodations={data}/>
        </>
    );
}