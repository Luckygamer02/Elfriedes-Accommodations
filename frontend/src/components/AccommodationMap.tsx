// components/AccommodationMap.tsx
"use client";
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {useEffect, useState} from 'react';


interface AccommodationMapProps {
    address: string;
}

export default function AccommodationMap({ address }: AccommodationMapProps) {
    const [position, setPosition] = useState<[number, number]>([0, 0]);
    const [loading, setLoading] = useState(true);
    // Fix leaflet marker icons
    L.Marker.prototype.options.icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    useEffect(() => {
        const geocodeAddress = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
                );
                const data = await response.json();

                if (data.length > 0) {
                    setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            } finally {
                setLoading(false);
            }
        };

        geocodeAddress();
    }, [address]);

    if (loading) return <div>Loading map...</div>;
    if (!position[0] || !position[1]) return <div>Location not found</div>;

    return (
        <MapContainer
            center={position}
            zoom={15}
            style={{ height: '400px', width: '100%' }}
            className="rounded-lg"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    {address}
                </Popup>
            </Marker>
        </MapContainer>
    );
}