// components/SearchPage.tsx
"use client";
import { Suspense, useState } from "react";
import { Grid, Loader, Container, Title, Text, Alert, Pagination, Group } from "@mantine/core";
import AccommodationMap from "@/components/Map/AccommodationMap";
import httpClient from "@/lib/httpClient";
import { useSearchParams, useRouter } from "next/navigation";
import { Accommodation } from "@/models/accommodation/accommodation";
import SearchSideBar from "@/components/Searchbar/SearchSideBar";
import AccommodationRaster from "@/components/layout/AccommodationRaster";
import useSWR from "swr";
import { IconAlertCircle } from '@tabler/icons-react';
import {PaginatedResponse} from "@/models/backend";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Pagination and sorting params
    const pageParam = searchParams.get("page") || "0";

    // Build filter object with only set parameters
    // const filters: FilterAccommodationDTO = {
    //     city: cityParam || undefined,
    //     postalCode: postalCodeParam || undefined,
    //     name: nameParam || undefined,
    //     minBasePrice: minPriceParam ? Number(minPriceParam) : undefined,
    //     maxBasePrice: maxPriceParam ? Number(maxPriceParam) : undefined,
    //     minRating: minRatingParam ? Number(minRatingParam) : undefined,
    //     maxRating: maxRatingParam ? Number(maxRatingParam) : undefined,
    //     bedrooms: bedroomsParam ? Number(bedroomsParam) : undefined,
    //     bathrooms: bathroomsParam ? Number(bathroomsParam) : undefined,
    //     people: peopleParam ? Number(peopleParam) : undefined,
    //     livingRooms: roomsParam ? Number(roomsParam) : undefined,
    //     type: typeParam || undefined,
    //     festivalType: festivalTypeParam || undefined,
    //     festivalistId: festivalistParam ? Number(festivalistParam) : undefined,
    //     extras: extrasParam.length > 0 ? extrasParam : undefined,
    //     features: featuresParam.length > 0 ? featuresParam : undefined,
    //     page: Number(pageParam),
    //     size: Number(sizeParam),
    //     sortBy: sortByParam
    // };

    // Track the paginated response state
    const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Accommodation> | null>(null);

    // Build query string for the request
    const getQueryString = () => {
        return searchParams.toString();
    };

    // Fetch data with SWR
    const { data, error, isLoading } = useSWR(
        getQueryString() ? `/api/accommodations/search?${getQueryString()}` : null,
        async (url) => {
            const response = await httpClient.get<PaginatedResponse<Accommodation>>(url);
            // Store the full paginated response
            setPaginatedData(response.data);
            return response.data.content;
        },
        {
            suspense: false,
            revalidateOnFocus: false,
        }
    );

    // Handle page change
    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page - 1)); // Convert back to 0-based for API
        router.push(`?${params.toString()}`);
    };

    // Process address data for the map with type safety
    const accommodationAddresses: string[] = data
        ? data
            .map(accommodation => accommodation.address)
            .filter((addr): addr is Accommodation["address"] => addr != null)
            .map(addr => {
                // Create a properly formatted address string
                const parts = [
                    addr.street,
                    addr.houseNumber,
                    addr.postalCode,
                    addr.city,
                    addr.country
                ].filter(Boolean);
                return parts.join(", ");
            })
        : [];

    // Handle loading, error, and empty states
    if (isLoading) return (
        <Container size="xl" py="xl">
            <Grid>
                <Grid.Col span={3}>
                    <SearchSideBar />
                </Grid.Col>
                <Grid.Col span={9} className="flex items-center justify-center min-h-[60vh]">
                    <Loader size="xl" />
                </Grid.Col>
            </Grid>
        </Container>
    );

    if (error) return (
        <Container size="xl" py="xl">
            <Grid>
                <Grid.Col span={3}>
                    <SearchSideBar />
                </Grid.Col>
                <Grid.Col span={9}>
                    <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                        Failed to load accommodations. Please try again later.
                    </Alert>
                </Grid.Col>
            </Grid>
        </Container>
    );

    const noResults = !data || data.length === 0;
    const currentPage = Number(pageParam) + 1; // Convert to 1-based for UI
    const totalPages = paginatedData?.totalPages || 1;
    const totalItems = paginatedData?.totalElements || 0;

    // Render the search page
    return (
        <Container size="xl" py="xl">
            <Grid>
                <Grid.Col span={3}>
                    <SearchSideBar />
                </Grid.Col>
                <Grid.Col span={9}>
                    {noResults ? (
                        <Alert icon={<IconAlertCircle size={16} />} title="No Results" color="blue">
                            No accommodations found matching your search criteria. Try adjusting your filters.
                        </Alert>
                    ) : (
                        <>
                            <Title order={2} mb="md">
                                {totalItems} {totalItems === 1 ? 'Accommodation' : 'Accommodations'} Found
                            </Title>

                            <Suspense fallback={<div>Loading map...</div>}>
                                <AccommodationMap addressList={accommodationAddresses} />
                            </Suspense>

                            <Text mt="xl" mb="md" size="lg" w={500}>
                                Accommodation Results {paginatedData ?
                                `(Page ${currentPage} of ${totalPages})` : ''}
                            </Text>

                            <AccommodationRaster accommodations={data || []} />

                            {totalPages > 1 && (
                                <Group p="center" mt="xl">
                                    <Pagination
                                        total={totalPages}
                                        value={currentPage}
                                        onChange={handlePageChange}
                                        withEdges
                                    />
                                </Group>
                            )}
                        </>
                    )}
                </Grid.Col>
            </Grid>
        </Container>
    );
}