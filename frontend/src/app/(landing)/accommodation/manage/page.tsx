"use client"
import React, {useEffect, useState} from 'react';
import {Button} from "@mantine/core";
import {restClient} from "@/lib/httpClient";
import {useAuthGuard} from "@/lib/auth/use-auth";
import Loading from "@/components/loading";
import {Accommodation} from "@/models/accommodation/accommodation";
import useSWR, {BareFetcher} from "swr";
import {PaginatedResponse, RestResponse} from "@/models/backend";



export default function ManageAccommodation() {


    const {user} =  useAuthGuard({middleware: "auth"});
    const {
        data: accommodationresponse,
        error,
        mutate,
        isLoading
    } = useSWR<PaginatedResponse<Accommodation>>(user ? `api/accommodations/getbyUserid/${user.id}` : undefined,
        user
            ? () => restClient.getAccommodationsbyownerid(user.id).then(res => res.data) :
            () => restClient.getAccommodationsbyownerid(0).then(res => res.data)
    );
    console.log(accommodationresponse)
    console.log(user)
    if (!user) {
        return;
    }
    if (!user) return <Loading/>;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!accommodationresponse) {
        return;
    }

    const accommodations = accommodationresponse.content || [];

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
                        <div key={acc.id}
                             className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                                                <strong>Address:</strong><br/>
                                                {acc.address.street} {acc.address.houseNumber}<br/>
                                                {acc.address.zipCode} {acc.address.city}<br/>
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