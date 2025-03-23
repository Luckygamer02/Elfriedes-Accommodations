"use client"
import { useEffect, useState } from "react";
import useSWR from "swr";
import httpClient from "@/lib/httpClient";
import {PagedResponse} from "@/models/http/PagedResponse";
import {UserResponse} from "@/models/user/UserResponse";

type Accommodation = {
    id: number;
    name: string;
    location: string;
    price: string;
    image: string;
};

type Booking = {
    id: number;
    guestName: string;
    checkIn: string;
    checkOut: string;
};

import { useRouter } from "next/router";
//import { RestApplicationClient } from "../services/RestApplicationClient"; // Pfad ggf. anpassen


// const apiClient = new RestApplicationClient(httpClient);

export default function AccommodationsList() {
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const page = 1; // Aktuell statische Seite, kann dynamisch gemacht werden

    // const { data, error } = useSWR(`/api/admin/users?page=${page}`, async () => {
    //     try {
    //         const response = await apiClient.admin_getUsers({ page });
    //         return response.data;
    //     } catch (err) {
    //         console.error("Fehler beim Laden der Benutzer:", err);
    //         return null;
    //     }
    // });
    //
    // useEffect(() => {
    //     const loadAccommodations = async () => {
    //         if (!data) {
    //             router.push("/upload"); // Weiterleitung zur Upload-Seite, falls keine Daten vorhanden
    //             return;
    //         }
    //         try {
    //             setAccommodations(data.items || []);
    //         } catch (error) {
    //             console.error("Error fetching accommodations:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     loadAccommodations();
    // }, [data, router]);

    // const handleSelectAccommodation = async (acc: Accommodation) => {
    //     setSelectedAccommodation(acc);
    //     try {
    //         const response = await apiClient.getSession(); // Hier evtl. andere Methode nutzen
    //         setBookings(response.data.bookings || []);
    //     } catch (error) {
    //         console.error("Error fetching bookings:", error);
    //     }
    // };

    // const handleUpdateAccommodation = async () => {
    //     if (!selectedAccommodation) return;
    //     try {
    //         await apiClient.updateUser(selectedAccommodation.id.toString(), selectedAccommodation);
    //         alert("Accommodation updated successfully!");
    //     } catch (error) {
    //         console.error("Error updating accommodation:", error);
    //     }
    // };

    if (loading) {
        return <div className="p-6 text-center text-xl">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Accommodations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.map((acc) => (
                    <div
                        key={acc.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                        onClick={() => handleSelectAccommodation(acc)}
                    >
                        <img src={acc.image} alt={acc.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold">{acc.name}</h3>
                            <p className="text-gray-600">{acc.location}</p>
                            <p className="text-blue-500 font-bold mt-2">{acc.price}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedAccommodation && (
                <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold">Edit Accommodation</h3>
                    <input
                        type="text"
                        value={selectedAccommodation.name}
                        onChange={(e) =>
                            setSelectedAccommodation({ ...selectedAccommodation, name: e.target.value })
                        }
                        className="block w-full p-2 mt-2 border rounded"
                    />
                    <input
                        type="text"
                        value={selectedAccommodation.location}
                        onChange={(e) =>
                            setSelectedAccommodation({ ...selectedAccommodation, location: e.target.value })
                        }
                        className="block w-full p-2 mt-2 border rounded"
                    />
                    <input
                        type="text"
                        value={selectedAccommodation.price}
                        onChange={(e) =>
                            setSelectedAccommodation({ ...selectedAccommodation, price: e.target.value })
                        }
                        className="block w-full p-2 mt-2 border rounded"
                    />
                    <button
                        onClick={handleUpdateAccommodation}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Save Changes
                    </button>

                    <h3 className="text-xl font-bold mt-6">Bookings</h3>
                    {bookings.length > 0 ? (
                        <ul className="mt-2">
                            {bookings.map((booking) => (
                                <li key={booking.id} className="p-2 bg-white border rounded mt-2">
                                    {booking.guestName} - {booking.checkIn} to {booking.checkOut}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 mt-2">No bookings found.</p>
                    )}
                </div>
            )}
        </div>
    );
}




