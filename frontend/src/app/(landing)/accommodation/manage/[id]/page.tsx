"use client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { Accommodation, AccommodationType, CreateAccommodationRequest } from "@/models/accommodation/accommodation";
import useSWR from "swr";
import {Button, Loader, Select, TextInput, Textarea, Checkbox} from "@mantine/core";
import httpClient from "@/lib/httpClient";
import { zodResolver } from "@mantine/form";
import { validationSchema } from "@/components/upload/form";
import {useEffect} from "react"; // Your existing schema

export default function UpdateAccommodationPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { data, error, isLoading } = useSWR<Accommodation>(
        `api/accommodations/${id}`,
        url => httpClient.get<Accommodation>(url).then(res => res.data)
    );

    const form = useForm<CreateAccommodationRequest>({
        validate: zodResolver(validationSchema),
    });

    // Set initial values when data loads
    useEffect(() => {
        if (data) {
            form.setValues({
                title: data.title,
                description: data.description,
                basePrice: data.basePrice,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                people: data.people,
                livingRooms: data.livingRooms,
                type: data.type,
                festivalistId: data.festivalistId,
                ownerId: data.ownerId,
                address: data.address,
                features: data.features,
                appliedDiscounts: data.appliedDiscounts,
                extras: data.extras
            });
        }
    }, [data]);

    const handleSubmit = async (values: CreateAccommodationRequest) => {
        try {
            await httpClient.patch(`api/accommodations/${id}`, values);
            router.push("/manage-accommodations");
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <div>Error loading accommodation</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Update Accommodation</h1>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Title"
                    {...form.getInputProps('title')}
                    mb="md"
                />

                <Textarea
                    label="Description"
                    {...form.getInputProps('description')}
                    mb="md"
                    minRows={4}
                />

                <TextInput
                    label="Base Price"
                    type="number"
                    {...form.getInputProps('basePrice')}
                    mb="md"
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <TextInput
                        label="Bedrooms"
                        type="number"
                        {...form.getInputProps('bedrooms')}
                    />
                    <TextInput
                        label="Bathrooms"
                        type="number"
                        {...form.getInputProps('bathrooms')}
                    />
                    <TextInput
                        label="Max Guests"
                        type="number"
                        {...form.getInputProps('people')}
                    />
                    <Select
                        label="Accommodation Type"
                        data={Object.values(AccommodationType)}
                        {...form.getInputProps('type')}
                    />
                </div>

                {/* Address Fields */}
                <div className="space-y-4 mb-6">
                    <TextInput
                        label="Street"
                        {...form.getInputProps('address.street')}
                    />
                    <TextInput
                        label="House Number"
                        {...form.getInputProps('address.houseNumber')}
                    />
                    <TextInput
                        label="City"
                        {...form.getInputProps('address.city')}
                    />
                    <TextInput
                        label="Postal Code"
                        {...form.getInputProps('address.postalCode')}
                    />
                    <TextInput
                        label="Country"
                        {...form.getInputProps('address.country')}
                    />
                </div>

                {/* Features Checklist */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {Object.entries(form.values.features).map(([feature, value]) => (
                        <Checkbox
                            key={feature}
                            label={feature.charAt(0).toUpperCase() + feature.slice(1)}
                            checked={value}
                            onChange={e => form.setFieldValue(`features.${feature}`, e.target.checked)}
                        />
                    ))}
                </div>

                <Button type="submit" fullWidth size="lg">
                    Update Accommodation
                </Button>
            </form>
        </div>
    );
}