"use client"

import ErrorFeedback from "@/components/error-feedback";
import { useAuthGuard } from "@/lib/auth/use-auth";
import httpClient, { restClient } from "@/lib/httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";



export const schema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phone: z.string().min(6, "Phone number must be at least 6 digits"),
    address: z.object({
        street: z.string().min(2, "Street must be at least 2 characters"),
        houseNumber: z.string().min(1, "House number is required"),
        city: z.string().min(2, "City must be at least 2 characters"),
        postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
        country: z.string().min(2, "Country must be at least 2 characters")
    })
});
type Schema = z.infer<typeof schema>;
export default function UpdateBasicDetailsForm() {
    const { user, mutate } = useAuthGuard({ middleware: "auth" });
    const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(undefined);

    const onSubmit = (data: Schema) => {
        setErrors(undefined);
        restClient.updateUser(user!.id.toString(), data)
            .then(() => {
                toast.success("Profile updated successfully");
                mutate();
            })
            .catch((error) => {
                const errData = error.response.data as HttpErrorResponse;
                setErrors(errData);
            });
    };

    useEffect(() => {
        if (user) {
            form.setFieldValue("firstName", user.firstName || '');
            form.setFieldValue("lastName", user.lastName || '');
            form.setFieldValue("address", user.address ? {
                street: user.address.street || '',
                houseNumber: user.address.houseNumber || '',
                city: user.address.city || '',
                postalCode: user.address.postalCode || '',
                country: user.address.country || ''
            } : {
                street: '',
                houseNumber: '',
                city: '',
                postalCode: '',
                country: ''
            }
            );

        }
    }, [user])

    const form = useForm({
        initialValues: {
            firstName: "",
            lastName: "",
            phone: "",
            address: {
                street: "",
                houseNumber: "",
                city: "",
                postalCode: "",
                country: ""
            }
        },
        validate: zodResolver(schema),
    });

    return (
        <div className="max-w-screen-sm">
            <form
                onSubmit={form.onSubmit(onSubmit)}
                className="flex flex-col gap-y-2"
            >
                <TextInput {...form.getInputProps('firstName')} label="First name" />
                <TextInput {...form.getInputProps('lastName')} label="Last name" />
                <TextInput {...form.getInputProps('phone')} label="Phone number" />
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <TextInput
                            label="Street"
                            className="flex-1"
                            {...form.getInputProps('address.street')}
                        />
                        <TextInput
                            label="House Number"
                            className="w-1/4"
                            {...form.getInputProps('address.houseNumber')}
                        />
                    </div>

                    <div className="flex gap-4">
                        <TextInput
                            label="City"
                            className="flex-1"
                            {...form.getInputProps('address.city')}
                        />
                        <TextInput
                            label="Postal Code"
                            className="w-1/3"
                            {...form.getInputProps('address.postalCode')}
                        />
                    </div>

                    <TextInput
                        label="Country"
                        {...form.getInputProps('address.country')}
                    />
                </div>
                <Button type="submit">Update profile</Button>
            </form>

            <ErrorFeedback data={errors} />
        </div>
    );
}