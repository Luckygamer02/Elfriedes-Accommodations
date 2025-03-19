import {Button} from "@mantine/core";
import Link from "next/link";

export  default function mangaeaccommodation(){
    const accommodations = [
        {
            id: 1,
            name: "Cozy Mountain Cabin",
            location: "Aspen, Colorado",
            price: "$120/night",
            image: "https://source.unsplash.com/400x300/?cabin,mountains",
        },
        {
            id: 2,
            name: "Beachfront Bungalow",
            location: "Malibu, California",
            price: "$200/night",
            image: "https://source.unsplash.com/400x300/?beach,house",
        },
        {
            id: 3,
            name: "Urban Loft Apartment",
            location: "New York City, NY",
            price: "$180/night",
            image: "https://source.unsplash.com/400x300/?apartment,city",
        },
        {
            id: 4,
            name: "Luxury Villa",
            location: "Santorini, Greece",
            price: "$350/night",
            image: "https://source.unsplash.com/400x300/?villa,sea",
        },
    ];
    return(
        <div>
            <h2 className="text-2xl font-bold mb-4">Accommodations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.map((acc) => (
                    <a href={`/accommodation/manage/${acc.id}`} key={acc.id}>
                    <div
                        key={acc.id}
                        className=" rounded-2xl shadow-lg overflow-hidden"
                    >
                        <img src={acc.image} alt={acc.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold">{acc.name}</h3>
                            <p className="text-gray-600">{acc.location}</p>
                            <p className="text-blue-500 font-bold mt-2">{acc.price}</p>
                        </div>
                    </div>
                    </a>
                ))}
            </div>
            <Button className="float-right">Add</Button>
        </div>
    );
}