"use client"
import {Button, Checkbox, Fieldset, Group, NumberInput, Select, Text, Textarea, TextInput} from "@mantine/core";
import {useForm, zodResolver} from "@mantine/form";
import {z} from "zod";
import {
    Accommodation,
    AccommodationType,
    CreateAccommodationRequest,
    CreateDiscountRequest,
    Extrastype,
    Festival
} from "@/models/accommodation/accommodation";
import {DateInput} from "@mantine/dates";
import '@mantine/dates/styles.css';
import {IconArrowDown, IconArrowUp, IconPhoto, IconUpload, IconX} from '@tabler/icons-react';
import {Dropzone, FileWithPath, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import httpClient, {restClient} from "@/lib/httpClient";
import React, {useState} from "react";
import {MultipartFile, URI} from "@/models/backend";
import useSWR from "swr";

// Validation schemas per step
const stepValidationSchemas = {
    // Step 1: Basic Information
    1: z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        basePrice: z.number().positive("Price must be positive"),
        bedrooms: z.number().nonnegative("Cannot be negative"),
        bathrooms: z.number().nonnegative("Cannot be negative"),
        people: z.number().positive("Must accommodate at least 1 person"),
        livingRooms: z.number().nonnegative("Cannot be negative"),
        type: z.nativeEnum(AccommodationType),
        festivalistId: z.number().positive("Festivalist ID is required").optional(),
        ownerId: z.number().positive("Owner ID is required"),
    }),

    // Step 2: Address
    2: z.object({
        address: z.object({
            street: z.string().min(1, "Street is required"),
            houseNumber: z.string().min(1, "House number is required"),
            city: z.string().min(1, "City is required"),
            postalCode: z.string().min(1, "Postal code is required"),
            country: z.string().min(1, "Country is required"),
        }),
    }),

    // Step 3: Pictures
    3: z.object({
        pictures: z.array(z.object({
            file: z.custom<MultipartFile>(),
            position: z.number().int().nonnegative()
        })).min(1, "At least one image is required")
    }),

    // Step 4: Features
    4: z.object({
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
    }),

    // Step 5: Discounts and Extras
    5: z.object({
        discounts: z.array(z.object({
            discountprocent: z.number().min(0).max(100, "Discount must be between 0-100%"),
            name: z.string().min(1, "Discount name is required"),
            startDate: z.string(),
            expiringDate: z.string(),
        })),
        extras: z.array(z.object({
            type: z.nativeEnum(Extrastype),
            price: z.number().positive("Price must be positive"),
        })),
    }),
};

// Complete validation schema for final submission
export const validationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    basePrice: z.number().positive("Price must be positive"),
    bedrooms: z.number().nonnegative("Cannot be negative"),
    bathrooms: z.number().nonnegative("Cannot be negative"),
    people: z.number().positive("Must accommodate at least 1 person"),
    livingRooms: z.number().nonnegative("Cannot be negative"),
    type: z.nativeEnum(AccommodationType),
    festivalistId: z.number().positive("Festivalist ID is required").optional(),
    ownerId: z.number().positive("Owner ID is required"),
    address: z.object({
        street: z.string().min(1, "Street is required"),
        houseNumber: z.string().min(1, "House number is required"),
        city: z.string().min(1, "City is required"),
        postalCode: z.string().min(1, "Postal code is required"),
        country: z.string().min(1, "Country is required"),
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
    discounts: z.array(z.object({
        discountprocent: z.number().min(0).max(100, "Discount must be between 0-100%"),
        name: z.string().min(1, "Discount name is required"),
        startDate: z.string(),
        expiringDate: z.string(),
    })),
    extras: z.array(z.object({
        type: z.nativeEnum(Extrastype),
        price: z.number().positive("Price must be positive"),
    })),
    pictures: z.array(z.object({
        file: z.custom<MultipartFile>(),
        position: z.number().int().nonnegative()
    })).min(1, "At least one image is required")
});

// Fetcher function for SWR
const fetcher = (url: string) => httpClient.get<Festival[]>(url).then(res => res.data);

// SWR Hook for festivals
export const useFestivals = (accommodationId?: number) => {
    const url = accommodationId
        ? `/api/festivals/accommodation/${accommodationId}`
        : '/api/festivals';

    const { data, error, mutate } = useSWR<Festival[]>(url, fetcher);

    return {
        festivals: data,
        isLoading: !error && !data,
        isError: error,
        revalidate: mutate
    };
};



// Updated type to include position
type PictureWithPosition = {
    file: MultipartFile;
    position: number;
};

interface UploadFormProps {
    userid: number;
    step: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export const convertFileToMultipart = async (file: File): Promise<MultipartFile> => {
    const arrayBuffer = await file.arrayBuffer();
    const objectUrl = URL.createObjectURL(file);
    const byteArray = new Uint8Array(arrayBuffer);

    return {
        contentType: file.type,
        name: file.name,
        bytes: Array.from(new Uint8Array(arrayBuffer)),
        empty: file.size === 0,
        inputStream: () => new Blob([byteArray]).stream(),
        resource: {
            open: false,
            file: file,
            readable: true,
            url: new URL(objectUrl),
            description: file.name,
            uri: {
                scheme: 'file',
                path: file.name,
                toString: () => `file://${file.name}`
            } as unknown as URI,
            filename: file.name,
            inputStream: () => new Blob([arrayBuffer]).stream()
        },
        size: file.size,
        originalFilename: file.name
    };
};

export default function CreateAccommodationForm({
                                                    userid,
                                                    step,
                                                    setActiveStep,
                                                }: UploadFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [stepErrors, setStepErrors] = useState<string[]>([]);
    const { festivals, isLoading: festivalsLoading, isError: festivalsError } = useFestivals();
    // Type for the form with updated picture structure
    type FormValues = Omit<CreateAccommodationRequest, 'pictures'> & {
        pictures: PictureWithPosition[]
    };

    const form = useForm<FormValues>({
        initialValues: {
            title: '',
            description: '',
            basePrice: 0,
            bedrooms: 0,
            bathrooms: 0,
            people: 0,
            livingRooms: 1,
            type: AccommodationType.FLAT,
            festivalistId: 0,
            ownerId: userid,
            address: {
                street: '',
                houseNumber: '',
                city: '',
                postalCode: '',
                country: '',
            },
            features: {
                ac: false,
                garden: false,
                kitchen: false,
                microwave: false,
                meetingTable: false,
                pool: false,
                tv: false,
                washingMachine: false,
                wifi: false,
            },
            discounts: [],
            extras: [],
            pictures: []
        },
        validate: zodResolver(validationSchema),
    });

    // Validate the current step before allowing navigation
    const validateStep = () => {
        const currentSchema = stepValidationSchemas[step as keyof typeof stepValidationSchemas];
        if (!currentSchema) return true; // No schema for this step (should not happen)

        const result = currentSchema.safeParse(form.values);
        if (!result.success) {
            // Convert Zod errors to string array
            const errors = result.error.errors.map(err =>
                `${err.path.join('.')}: ${err.message}`
            );
            setStepErrors(errors);
            return false;
        }

        setStepErrors([]);
        return true;
    };

    const handleNextStep = () => {
        if (validateStep()) {
            setActiveStep((prev) => Math.min(6, prev + 1));
        }
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        // Validate the entire form before submission
        const validationResult = validationSchema.safeParse(form.values);
        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(err =>
                `${err.path.join('.')}: ${err.message}`
            );
            setStepErrors(errors);
            return;
        }

        setSubmitting(true);
        try {
            const values = form.values;
            const formData = new FormData();

            // Sort pictures by position before submitting
            const sortedPictures = [...values.pictures].sort((a, b) => a.position - b.position);

            // Extract just the files to match the API's expected format
            const filesOnly = sortedPictures.map(p => p.file);

            // Format dates properly for API
            const formattedDiscounts: CreateDiscountRequest[] = values.discounts.map(discount => ({
                ...discount,
                startDate: discount.startDate,
                expiringDate: discount.expiringDate
            }));

            const { pictures, ...jsonData } = values;
            const submitData = {
                ...jsonData,
                discounts: formattedDiscounts,
                // Include position info in the metadata
                picturePositions: sortedPictures.map((p, idx) => ({
                    index: idx,
                    position: p.position
                }))
            };

            // Append JSON as Blob
            formData.append(
                "data",
                new Blob([JSON.stringify(submitData)], {type: "application/json"}),
                "data.json"
            );

            // Append files properly
            filesOnly.forEach((file, index) => {
                const fileObj = new File(
                    [new Uint8Array(file.bytes)],
                    file.originalFilename,
                    {type: file.contentType}
                );
                formData.append("files", fileObj);
            });

            // Submit form
            const response = await restClient.createAccommodation(formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Success:", response.data);
            // Navigate to success page or show success message
        } catch (err) {
            console.error("Error submitting form:", err);
            setStepErrors(["Failed to submit form. Please try again."]);
        } finally {
            setSubmitting(false);
        }
    };

    // Move picture up in order (decrease position number)
    const movePictureUp = (index: number) => {
        if (index <= 0) return; // Already at the top

        const newPictures = [...form.values.pictures];
        // Swap positions with the picture above
        const temp = newPictures[index].position;
        newPictures[index].position = newPictures[index - 1].position;
        newPictures[index - 1].position = temp;

        // Sort by position to update the display order
        form.setFieldValue('pictures',
            newPictures.sort((a, b) => a.position - b.position)
        );
    };

    // Move picture down in order (increase position number)
    const movePictureDown = (index: number) => {
        if (index >= form.values.pictures.length - 1) return; // Already at the bottom

        const newPictures = [...form.values.pictures];
        // Swap positions with the picture below
        const temp = newPictures[index].position;
        newPictures[index].position = newPictures[index + 1].position;
        newPictures[index + 1].position = temp;

        // Sort by position to update the display order
        form.setFieldValue('pictures',
            newPictures.sort((a, b) => a.position - b.position)
        );
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Fieldset legend="Basic Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label="Title"
                                required
                                {...form.getInputProps('title')}
                            />
                            <Textarea
                                label="Description"
                                required
                                {...form.getInputProps('description')}
                            />
                            <NumberInput
                                label="Base Price"
                                required
                                min={0}
                                {...form.getInputProps('basePrice')}
                            />
                            <Select
                                label="Accommodation Type"
                                required
                                data={Object.values(AccommodationType)}
                                {...form.getInputProps('type')}
                            />
                            <NumberInput
                                label="Bedrooms"
                                min={0}
                                {...form.getInputProps('bedrooms')}
                            />
                            <NumberInput
                                label="Bathrooms"
                                min={0}
                                {...form.getInputProps('bathrooms')}
                            />
                            <NumberInput
                                label="Max People"
                                required
                                min={1}
                                {...form.getInputProps('people')}
                            />
                            <NumberInput
                                label="Living Rooms"
                                min={0}
                                {...form.getInputProps('livingRooms')}
                            />
                            {festivalsError ? (
                                  <Text c="red">Failed to load festivals</Text>
                               ) : (
                                  <Select
                                    label="Festival"
                                    placeholder={festivalsLoading ? "Loading…" : "Select festival"}
                                    required
                                    searchable
                                    data={
                                      festivals?.map(f => ({
                                        value: f.id.toString(),
                                        label: f.name,
                                      })) ?? []
                                    }
                                // the form field is a number, so we coerce the string back to number
                                    {...form.getInputProps('festivalistId', {
                                      valueProp: 'value',
                                      onChange: (val) =>
                                        form.setFieldValue(
                                          'festivalistId',
                                          val ? Number(val) : 0
                                        ),
                                    })}
                                  />
                                )}
                        </div>
                    </Fieldset>
                );

            case 2:
                return (
                    <Fieldset legend="Address">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label="Street"
                                required
                                {...form.getInputProps('address.street')}
                            />
                            <TextInput
                                label="House Number"
                                required
                                {...form.getInputProps('address.houseNumber')}
                            />
                            <TextInput
                                label="City"
                                required
                                {...form.getInputProps('address.city')}
                            />
                            <TextInput
                                label="Postal Code"
                                required
                                {...form.getInputProps('address.postalCode')}
                            />
                            <TextInput
                                label="Country"
                                required
                                {...form.getInputProps('address.country')}
                            />
                        </div>
                    </Fieldset>
                );

            case 3:
                return (
                    <Fieldset legend="Pictures">
                        <Dropzone
                            onDrop={async (files: FileWithPath[]) => {
                                // Convert files to MultipartFile and add position
                                const convertedFiles = await Promise.all(
                                    files.map(async (file) => {
                                        const multipartFile = await convertFileToMultipart(file);
                                        return {
                                            file: multipartFile,
                                            // Assign position after the last current position
                                            position: form.values.pictures.length > 0
                                                ? Math.max(...form.values.pictures.map(p => p.position)) + 1
                                                : 0
                                        };
                                    })
                                );

                                // Add new files to existing ones
                                form.setFieldValue('pictures', [
                                    ...form.values.pictures,
                                    ...convertedFiles
                                ]);
                            }}
                            onReject={(files) => console.log('rejected files', files)}
                            maxSize={5 * 1024 ** 2}
                            accept={IMAGE_MIME_TYPE}
                        >
                            <Group justify="center" gap="xl" mih={220} style={{pointerEvents: 'none'}}>
                                <Dropzone.Accept>
                                    <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5}/>
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5}/>
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5}/>
                                </Dropzone.Idle>

                                <div>
                                    <Text size="xl" inline>
                                        Drag images here or click to select files
                                    </Text>
                                    <Text size="sm" c="dimmed" inline mt={7}>
                                        Attach as many files as you like, each file should not exceed 5mb
                                    </Text>
                                </div>
                            </Group>
                        </Dropzone>

                        {form.values.pictures.length > 0 && (
                            <Text size="sm" fw={500} mt={16} mb={8}>
                                Image Order (first image is the main image)
                            </Text>
                        )}

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {form.values.pictures.map((pic, index) => (
                                <div key={index} className="relative border rounded p-2">
                                    <div className="relative">
                                        <img
                                            src={URL.createObjectURL(new Blob([new Uint8Array(pic.file.bytes)]))}
                                            alt={`Preview ${index}`}
                                            className="h-32 w-full object-cover rounded"
                                        />
                                        <Text
                                            size="xs"
                                            className="absolute top-1 left-1 bg-gray-800 text-white px-2 py-1 rounded"
                                        >
                                            {pic.position === 0 ? 'Main Image' : `Position: ${pic.position}`}
                                        </Text>
                                        <Button
                                            variant="subtle"
                                            color="red"
                                            size="xs"
                                            className="absolute top-1 right-1"
                                            onClick={() => form.removeListItem('pictures', index)}
                                        >
                                            <IconX size={16}/>
                                        </Button>
                                    </div>

                                    <Group justify="apart" mt={8}>
                                        <Text size="sm" truncate>
                                            {pic.file.originalFilename}
                                        </Text>
                                        <Group gap={4}>
                                            <Button
                                                variant="subtle"
                                                size="xs"
                                                disabled={index === 0}
                                                onClick={() => movePictureUp(index)}
                                            >
                                                <IconArrowUp size={16} />
                                            </Button>
                                            <Button
                                                variant="subtle"
                                                size="xs"
                                                disabled={index === form.values.pictures.length - 1}
                                                onClick={() => movePictureDown(index)}
                                            >
                                                <IconArrowDown size={16} />
                                            </Button>
                                        </Group>
                                    </Group>
                                </div>
                            ))}
                        </div>
                    </Fieldset>
                );

            case 4:
                return (
                    <Fieldset legend="Features">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.keys(form.values.features).map((feature) => (
                                <Checkbox
                                    key={feature}
                                    checked={form.values.features[feature as keyof typeof form.values.features]}
                                    label={feature.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() +
                                        feature.replace(/([A-Z])/g, ' $1').trim().slice(1)}
                                    {...form.getInputProps(`features.${feature}`)}
                                />
                            ))}
                        </div>
                    </Fieldset>
                );

            case 5:
                return (
                    <>
                        <Fieldset legend="Discounts">
                            {form.values.discounts.map((_, index) => (
                                <div key={index} className="border p-4 mb-4 rounded">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <NumberInput
                                            label="Discount Percentage"
                                            required
                                            min={0}
                                            max={100}
                                            {...form.getInputProps(`discounts.${index}.discountprocent`)}
                                        />
                                        <TextInput
                                            label="Discount Name"
                                            required
                                            {...form.getInputProps(`discounts.${index}.name`)}
                                        />
                                        <DateInput
                                            label="Start Date"
                                            valueFormat="YYYY-MM-DD"
                                            onChange={(date) => {
                                                if (date) {
                                                    form.setFieldValue(
                                                        `discounts.${index}.startDate`,
                                                        date.toISOString().split('T')[0]
                                                    );
                                                }
                                            }}
                                        />
                                        <DateInput
                                            label="Expiring Date"
                                            valueFormat="YYYY-MM-DD"
                                            onChange={(date) => {
                                                if (date) {
                                                    form.setFieldValue(
                                                        `discounts.${index}.expiringDate`,
                                                        date.toISOString().split('T')[0]
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        color="red"
                                        className="mt-2"
                                        onClick={() => form.removeListItem('discounts', index)}
                                    >
                                        Remove Discount
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                className="mt-4"
                                onClick={() => form.insertListItem('discounts', {
                                    discountprocent: 0,
                                    name: '',
                                    startDate: new Date().toISOString().split('T')[0],
                                    expiringDate: new Date().toISOString().split('T')[0]
                                })}
                            >
                                Add Discount
                            </Button>
                        </Fieldset>

                        <Fieldset legend="Extras" className="mt-4">
                            {form.values.extras.map((_, index) => (
                                <div key={index} className="border p-4 mb-4 rounded">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Select
                                            label="Extra Type"
                                            required
                                            data={Object.values(Extrastype).map(type => ({
                                                value: type,
                                                label: type.replace(/_/g, ' ').toLowerCase()
                                                    .replace(/\b\w/g, c => c.toUpperCase())
                                            }))}
                                            {...form.getInputProps(`extras.${index}.type`)}
                                        />
                                        <NumberInput
                                            label="Price"
                                            required
                                            min={0}
                                            {...form.getInputProps(`extras.${index}.price`)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        color="red"
                                        className="mt-2"
                                        onClick={() => form.removeListItem('extras', index)}
                                    >
                                        Remove Extra
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                className="mt-4"
                                onClick={() => form.insertListItem('extras', {type: Extrastype.CLEANING, price: 0})}
                            >
                                Add Extra
                            </Button>
                        </Fieldset>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Create New Accommodation</h2>

            {stepErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <h3 className="font-semibold">Please fix the following errors:</h3>
                    <ul className="list-disc pl-5">
                        {stepErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // Form submission is handled by the Create button
                }}
                className="space-y-6"
            >
                {renderStepContent()}

                <Group justify="center" className="mt-8">
                    {step > 1 && (
                        <Button
                            type="button"
                            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                        >
                            Previous
                        </Button>
                    )}

                    {step === 5 ? (
                        <Button
                            type="button"
                            loading={submitting}
                            disabled={submitting}
                            onClick={handleSubmit}
                        >
                            Create Accommodation
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleNextStep}
                        >
                            Next
                        </Button>
                    )}
                </Group>
            </form>
        </div>
    );
}