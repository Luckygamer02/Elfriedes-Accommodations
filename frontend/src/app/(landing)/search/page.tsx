"use client"
import AccommodationMap from "@/components/Map/AccommodationMap";
import {restClient} from "@/lib/httpClient";
import { useSearchParams} from "next/navigation";
import {Accommodation, AccommodationType, Extrastype} from "@/models/accommodation/accommodation";
import {useMemo} from "react";
import SearchSideBar from "@/components/Searchbar/SearchSideBar";
import AccommodationRaster from "@/components/layout/AccommodationRaster";
import useSWR from "swr";
import dynamic from "next/dynamic";

export default function SearchPage() {

    const searchParams = useSearchParams();
    // 1. Lese Roh-Parameter aus URL
    const cityParam = searchParams.get("city");
    const typeParam = searchParams.get("type") as AccommodationType | null;
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const extrasParam = searchParams.getAll("extras") as Extrastype[];
    const featuresParam = searchParams.getAll(
        "features"
    ) as (keyof Accommodation["features"])[];

    // 2. Baue daraus nur die tatsächlich gesetzten Filter
    const filters = useMemo(() => {
        const f: {
            city?: string;
            type?: AccommodationType;
            minPrice?: number;
            maxPrice?: number;
            extras?: Extrastype[];
            features?: (keyof Accommodation["features"])[];
        } = {};
        if (cityParam) f.city = cityParam;
        if (typeParam) f.type = typeParam;
        if (minPriceParam) f.minPrice = Number(minPriceParam);
        if (maxPriceParam) f.maxPrice = Number(maxPriceParam);
        if (extrasParam.length) f.extras = extrasParam;
        if (featuresParam.length) f.features = featuresParam;
        return f;
    }, [
        cityParam,
        typeParam,
        minPriceParam,
        maxPriceParam,
        extrasParam.join("|"),
        featuresParam.join("|"),
    ]);
    const queryKey = ['accommodations', filters];
    const { data, error, isLoading } = useSWR(
        queryKey,
        () => restClient.getAccommodationbySearchParams(filters).then(res => res),
    );
    if(!data) return (
        <div>Loading...</div>
    )
    const accommodationAddresses: string[] = data
        .map(data => data.address)
        .filter(addr => addr != null)
        .map(addr => String(addr));


    return (
        <>
            <SearchSideBar />
            <AccommodationMap addressList={accommodationAddresses}/>
            <AccommodationRaster accommodations={data}/>
        </>
    );
}