"use client";

import ErrorFeedback from "@/components/error-feedback";
import SuccessFeedback from "@/components/success-feedback";
import {restClient} from "@/lib/httpClient";
import {cn} from "@/lib/utils";
import {HttpErrorResponse} from "@/models/http/HttpErrorResponse";
import {Button, TextInput} from "@mantine/core";
import {useForm, zodResolver} from "@mantine/form";
import Link from "next/link";
import React from "react";
import {toast} from "sonner";
import {z} from "zod";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

const registerSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        passwordConfirmation: z.string().min(8),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, "Invalid phone number format").optional(),
        address: z.object({
            street: z.string().min(2, "Street must be at least 2 characters"),
            houseNumber: z.string().min(1, "House number is required"),
            city: z.string().min(2, "City must be at least 2 characters"),
            postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
            country: z.string().min(2, "Country must be at least 2 characters")
        }).optional()
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    });

type Schema = z.infer<typeof registerSchema>;

export function UserRegisterForm({className, ...props}: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<boolean>(false);
    const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
        undefined
    );

    async function onSubmit(data: Schema) {
        setErrors(undefined);
        setSuccess(false);
        setIsLoading(true);
        restClient.createUser(data)
            .then(() => {
                toast.success("Account created successfully");
                setSuccess(true);
            })
            .catch((error) => {
                const errData = error.response.data as HttpErrorResponse;
                setErrors(errData);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
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
        validate: zodResolver(registerSchema),
    });

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <SuccessFeedback
                show={success}
                message="Account created"
                description="Verfication email will be sent to your inbox, please click the link in the email to verify your account"
                action={
                    <Link href="/auth/login" className="underline">
                        Login
                    </Link>
                }
            />

            <form onSubmit={form.onSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-2">
                        <TextInput
                            id="email"
                            placeholder="name@example.com"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            label="Email"
                            {...form.getInputProps("email")}
                        />

                        <TextInput
                            id="password"
                            type="password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading}
                            label="Password"
                            {...form.getInputProps("password")}
                        />

                        <TextInput
                            id="passwordConfirmation"
                            type="password"
                            disabled={isLoading}
                            label="Confirm password"
                            {...form.getInputProps("passwordConfirmation")}
                        />

                        <TextInput
                            id="firstName"
                            type="text"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading}
                            label="First name"
                            {...form.getInputProps("firstName")}
                        />

                        <TextInput
                            id="lastName"
                            type="text"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading}
                            label="Last name"
                            {...form.getInputProps("lastName")}
                        />
                        <TextInput
                            id="phone"
                            placeholder="+1234567890"
                            type="tel"
                            disabled={isLoading}
                            label="Phone Number"
                            {...form.getInputProps("phone")}
                        />

                        <div className="grid gap-2">
                            {/* Street and House Number */}
                            <div className="flex gap-2">
                                <TextInput
                                    id="street"
                                    placeholder="Main Street"
                                    disabled={isLoading}
                                    label="Street"
                                    className="flex-1"
                                    {...form.getInputProps("address.street")}
                                />
                                <TextInput
                                    id="houseNumber"
                                    placeholder="123"
                                    disabled={isLoading}
                                    label="House Number"
                                    className="w-1/4"
                                    {...form.getInputProps("address.houseNumber")}
                                />
                            </div>

                            {/* City and Postal Code */}
                            <div className="flex gap-2">
                                <TextInput
                                    id="city"
                                    placeholder="New York"
                                    disabled={isLoading}
                                    label="City"
                                    className="flex-1"
                                    {...form.getInputProps("address.city")}
                                />
                                <TextInput
                                    id="postalCode"
                                    placeholder="10001"
                                    disabled={isLoading}
                                    label="Postal Code"
                                    className="w-1/3"
                                    {...form.getInputProps("address.postalCode")}
                                />
                            </div>

                            {/* Country */}
                            <TextInput
                                id="country"
                                placeholder="Country"
                                disabled={isLoading}
                                label="Country"
                                {...form.getInputProps("address.country")}
                            />
                        </div>
                    </div>

                    <ErrorFeedback data={errors}/>

                    <Button disabled={isLoading} type="submit">
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </Button>
                </div>
            </form>
        </div>
    );
}