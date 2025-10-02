"use client";
import {useParams, useRouter} from "next/navigation";
import {useForm, zodResolver} from "@mantine/form";
import {
    Accommodation,
    AccommodationType,
    CreateAccommodationRequest,
    Extratype
} from "@/models/accommodation/accommodation";
import useSWR from "swr";
import {Button, Checkbox, Loader, Notification, NumberInput, Select, Textarea, TextInput} from "@mantine/core";
import httpClient from "@/lib/httpClient";
import {useEffect, useState} from "react";
import {useAuthGuard} from "@/lib/auth/use-auth";
import {z} from "zod";
import {showNotification} from "@mantine/notifications"; // Your existing schema
import UplaodandDeleteImages from "@/components/upload/UplaodandDeleteImages";

export default function UpdateAccommodationPage() {
    const router = useRouter();
    const {user} = useAuthGuard({middleware: "auth"});
    const {id} = useParams<{ id: string }>();
    const {data, error, isLoading} = useSWR<Accommodation>(
        `api/accommodations/${id}`,
        (url: string) => httpClient.get<Accommodation>(url).then(res => res.data)
    );
    const [submitError, setSubmitError] = useState<string | null>(null);

    const validationSchema = z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        basePrice: z.number().positive(),
        bedrooms: z.number().nonnegative(),
        bathrooms: z.number().nonnegative(),
        people: z.number().positive(),
        livingRooms: z.number().nonnegative(),
        type: z.nativeEnum(AccommodationType),
        festivalistId: z.number().positive(),
        ownerId: z.number().positive(),
        address: z.object({
            street: z.string().min(1),
            houseNumber: z.string().min(1),
            city: z.string().min(1),
            postalCode: z.string().min(1),
            country: z.string().min(1),
        }),
        features: z.object({
            ac: z.boolean(),
            garden: z.boolean(),
            kitchen: z.boolean(),
            microwave: z.boolean(),
            meetingTable: z.boolean(),
            pool: z.boolean(),
            tv: z.boolean(),
            washingMachine: z.boolean(),
            wifi: z.boolean(),
        }),
        discount: z.object({
            discountprocent: z.number().min(0).max(100),
            name: z.string().min(1),
            expioringdate: z.date(),
        }).optional(),


        extras: z.array(z.object({
            type: z.nativeEnum(Extratype),
            price: z.number().positive(),
        }))
    });


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
                discount: data.discount,
                extras: data.extras
            });
        }
    }, [data, form]);


    const handleSubmit = async (values: CreateAccommodationRequest) => {
        setSubmitError(null);

        try {
            const response = await httpClient.patch(
                `api/accommodations/${id}`,
                values
            );

            if (response.status === 200) {
                // 1. Erfolgsmeldung anzeigen
                showNotification({
                    title: 'Success',
                    message: 'Accommodation updated successfully!',
                    color: 'green',
                    autoClose: 2000, // automatically closes after 2 seconds
                });


                router.push('http://localhost:3000/accommodation/manage/');

            } else {
                setSubmitError('Failed to update accommodation');
            }
        } catch (error: unknown) {
            console.error('Update failed:', error);
            setSubmitError(
                (error as {response?: {data?: {message?: string}}})?.response?.data?.message || 'An error occurred'
            );
        }
    };

    if (isLoading) return <Loader/>;
    if (error) return <div>Error loading accommodation</div>;
    if (data?.ownerId !== user?.id) {
        return <div>You are not authorized to edit this accommodation</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Update Accommodation</h1>

            {submitError && (
                <Notification color="red" onClose={() => setSubmitError(null)} mb="md">
                    {submitError}
                </Notification>
            )}

            <form
                onSubmit={form.onSubmit(
                    (values) => {
                        console.log("Form is valid. Submitting…");
                        handleSubmit(values);
                    },
                    (validationErrors) => {
                        console.warn("Validation failed:", validationErrors);
                    }
                )}
            >
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

                <NumberInput
                    label="Base Price"
                    {...form.getInputProps('basePrice')}
                    mb="md"
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <NumberInput
                        label="Bedrooms"
                        {...form.getInputProps('bedrooms')}
                    />
                    <NumberInput
                        label="Bathrooms"
                        {...form.getInputProps('bathrooms')}
                    />
                    <NumberInput
                        label="Max Guests"
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
                    {Object.entries(form.values.features || {}).map(([feature, value]) => (
                        <Checkbox
                            key={feature}
                            label={feature.charAt(0).toUpperCase() + feature.slice(1)}
                            checked={value}
                            onChange={e => form.setFieldValue(`features.${feature}`, e.target.checked)}
                        />
                    ))}
                </div>

                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                >
                    Update Accommodation
                </Button>
            </form>
            <form>
                <UplaodandDeleteImages id={id}/>
            </form>
        </div>
    );
}