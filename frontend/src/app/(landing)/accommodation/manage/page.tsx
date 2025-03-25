"use client"
import React, { useEffect, useState } from 'react';
import { Button } from "@mantine/core";
import { restClient } from "@/lib/httpClient";
import {useAuthGuard} from "@/lib/auth/use-auth";
import Loading from "@/components/loading";

export default function ManageAccommodation() {
    const [accommodations, setAccommodations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuthGuard({ middleware: "auth" });
    useEffect(() => {
        if (!user) return;
        const fetchAccommodations = async () => {
            try {
                const response = await restClient.getAccommodationsbyownerid(user.id);
                setAccommodations(response.data);
            } catch (err) {
                setError('Failed to load accommodations');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAccommodations();
    }, [user?.id]);

    if (!user) return <Loading />;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Accommodations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.map((acc) => (
                    <a href={`/accommodation/manage/${acc.id}`} key={acc.id}>
                        <div className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img
                                src={acc.image || '/placeholder-image.jpg'}
                                alt={acc.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold">{acc.title}</h3>
                                <p className="text-gray-600">{acc.address?.city}</p>
                                <p className="text-blue-500 font-bold mt-2">
                                    €{acc.basePrice}/night
                                </p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
            <Button
                component="a"
                href="/accommodation/create"
                className="float-right mt-6"
            >
                Add New Accommodation
            </Button>
        </div>
    );
}