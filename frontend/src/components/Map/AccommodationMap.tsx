// components/AccommodationMap.tsx
"use client";
import 'leaflet/dist/leaflet.css';
import {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';

interface AccommodationMapProps {
    addressList: string[];
}

const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    {ssr: false}
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    {ssr: false}
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    {ssr: false}
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    {ssr: false}
);

export default function AccommodationMap({addressList}: AccommodationMapProps) {
    const [locations, setLocations] = useState<
        { position: [number, number]; address: string }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // only load and patch Leaflet once we're on the client
        let L: typeof import('leaflet');
        if (typeof window !== 'undefined') {
            L = require('leaflet');
            // fix the default icon paths
            L.Marker.prototype.options.icon = L.icon({
                iconUrl:
                    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                iconRetinaUrl:
                    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                shadowUrl:
                    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
            });
        }

        async function geocodeAll() {
            const results = await Promise.all(
                addressList.map(async (addr) => {
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                                addr
                            )}`
                        );
                        const data: Array<{ lat: string; lon: string }> = await res.json();
                        if (data.length > 0) {
                            return {
                                position: [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number],
                                address: addr,
                            };
                        }
                    } catch (err) {
                        console.error('Geocoding error for', addr, err);
                    }
                    return null;
                })
            );
            setLocations(results.filter((r) => r !== null) as any);
            setLoading(false);
        }

        geocodeAll();
    }, [addressList]);

    if (loading) return <div>Loading map...</div>;
    if (!locations.length) return <div>No valid locations found</div>;
    const center = locations[0].position;
    return (
        <MapContainer
            center={center}
            zoom={15}
            style={{height: '400px', width: '100%',zIndex: 1}}
            className="rounded-lg"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc, idx) => (
                <Marker key={idx} position={loc.position}>
                    <Popup>{loc.address}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
