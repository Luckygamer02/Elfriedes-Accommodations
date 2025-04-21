"use client";
import React from "react";
import { Button } from "@mantine/core";
import httpClient, { restClient } from "@/lib/httpClient";
import { useAuthGuard } from "@/lib/auth/use-auth";
import Loading from "@/components/loading";
import { Accommodation } from "@/models/accommodation/accommodation";
import useSWR from "swr";
import { PaginatedResponse } from "@/models/backend";

export default function ManageAccommodation() {
    const { user } = useAuthGuard({ middleware: "auth" });

    // Fixed SWR implementation
    const {
        data,
        error,
        isLoading
    } = useSWR<PaginatedResponse<Accommodation>>(
        user?.id ? `api/accommodations/getbyUserid/${user.id}` : null,
        (url) => httpClient.get<PaginatedResponse<Accommodation>>(url).then(res => res.data),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    // Optimized loading state handling
    if (!user || !user.id || isLoading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    const accommodations = data?.content || [];

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Your Accommodations</h2>
            <Button
                component="a"
                href="/accommodation/create"
                className="mb-6 float-right"
            >
                Add New Accommodation
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.length > 0 ? (
                    accommodations.map((acc) => (
                        <div
                            key={acc.id}
                            className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <a href={`/accommodation/manage/${acc.id}`}>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{acc.title}</h3>
                                    <div className="space-y-1">
                                        <p className="text-gray-600">
                                            <strong>Type:</strong> {acc.type}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Base Price:</strong> €{acc.basePrice}/night
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Rooms:</strong> {acc.bedrooms} beds, {acc.bathrooms} baths
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Capacity:</strong> {acc.people} people
                                        </p>
                                        <div className="border-t pt-2 mt-2">
                                            <p className="text-gray-600">
                                                <strong>Address:</strong><br />
                                                {acc.address.street} {acc.address.houseNumber}<br />
                                                {acc.address.postalCode} {acc.address.city}<br />
                                                {acc.address.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500 text-lg">
                            You haven't listed any accommodations yet.
                        </p>
                        <Button
                            component="a"
                            href="/accommodation/create"
                            className="mt-4"
                        >
                            Create Your First Listing
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
