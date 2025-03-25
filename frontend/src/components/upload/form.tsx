import {Button, TextInput,Text, NumberInput, Checkbox, Select, Textarea, Fieldset, Group} from "@mantine/core";
import {useForm, zodResolver} from "@mantine/form";
import {z} from "zod";
import {AccommodationType, Extrastype} from "@/models/accommidation/accommodation";
import {DateInput} from "@mantine/dates";
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import {Dropzone, DropzoneProps, IMAGE_MIME_TYPE} from "@mantine/dropzone";

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
        zipCode: z.string().min(1),
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
    appliedDiscounts: z.array(z.object({
        discount: z.object({
            discountprocent: z.number().min(0).max(100),
            name: z.string().min(1),
            expioringdate: z.date(),
        }),
        appliedDate: z.date(),
    })),
    extras: z.array(z.object({
        type: z.nativeEnum(Extrastype),
        price: z.number().positive(),
    })),
});

interface UploadFormProps {
    userid: number;
    step: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function CreateAccommodationForm({
                                                    userid,
                                                    step,
                                                    setActiveStep,

                                                }: UploadFormProps) {
    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            basePrice: 0,
            bedrooms: 0,
            bathrooms: 0,
            people: 1,
            livingRooms: 0,
            type: AccommodationType.FLAT,
            festivalistId: 0,
            ownerId: userid,
            address: {
                street: '',
                houseNumber: '',
                city: '',
                zipCode: '',
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
            appliedDiscounts: [],
            extras: [],
        },
        validate: zodResolver(validationSchema),
    });

    const handleSubmit = (values: typeof form.values) => {
        console.log('Submitted values:', values);
        // Submit to API
    };
    const stepcontent = () => {
        if (step === 1)
        {
            return (
                <Fieldset legend="Basic Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput label="Title" {...form.getInputProps('title')} />
                        <Textarea label="Description" {...form.getInputProps('description')} />
                        <NumberInput label="Base Price" {...form.getInputProps('basePrice')} />
                        <Select
                            label="Accommodation Type"
                            data={Object.values(AccommodationType)}
                            {...form.getInputProps('type')}
                        />
                        <NumberInput label="Bedrooms" {...form.getInputProps('bedrooms')} />
                        <NumberInput label="Bathrooms" {...form.getInputProps('bathrooms')} />
                        <NumberInput label="Max People" {...form.getInputProps('people')} />
                        <NumberInput label="Living Rooms" {...form.getInputProps('livingRooms')} />
                        <NumberInput label="Festivalist ID" {...form.getInputProps('festivalistId')} />
                    </div>
                </Fieldset>
            );
        }
        else if(step === 2)
        {
            return (
            <Fieldset legend="Address">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput label="Street" {...form.getInputProps('address.street')} />
                    <TextInput label="House Number" {...form.getInputProps('address.houseNumber')} />
                    <TextInput label="City" {...form.getInputProps('address.city')} />
                    <TextInput label="Zip Code" {...form.getInputProps('address.zipCode')} />
                    <TextInput label="Country" {...form.getInputProps('address.country')} />
                </div>
            </Fieldset>
            );
        }
        else if(step === 3)
        {
            return (
                <Fieldset legend="Features">
                    <Dropzone
                        onDrop={(files) => console.log('accepted files', files)}
                        onReject={(files) => console.log('rejected files', files)}
                        maxSize={5 * 1024 ** 2}
                        accept={IMAGE_MIME_TYPE}
                    >
                        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                            <Dropzone.Accept>
                                <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
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
                </Fieldset>
            );
        }
        else if (step === 4)
        {
            return (
                <Fieldset legend="Features">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.keys(form.values.features).map((feature) => (
                            <Checkbox
                                key={feature}
                                label={feature.replace(/([A-Z])/g, ' $1').trim()}
                                {...form.getInputProps(`features.${feature}`)}
                            />
                        ))}
                    </div>
                </Fieldset>
            );
        }
        else if (step === 5)
        {
            return (
                <>
                <Fieldset legend="Applied Discounts">
                {form.values.appliedDiscounts.map((_, index) => (
                    <div key={index} className="border p-4 mb-4 rounded">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <NumberInput
                                label="Discount Percentage"
                                {...form.getInputProps(`appliedDiscounts.${index}.discount.discountprocent`)}
                            />
                            <TextInput
                                label="Discount Name"
                                {...form.getInputProps(`appliedDiscounts.${index}.discount.name`)}
                            />
                            <DateInput
                                label="Expiring Date"
                                {...form.getInputProps(`appliedDiscounts.${index}.discount.expioringdate`)}
                            />
                            <DateInput
                                label="Applied Date"
                                {...form.getInputProps(`appliedDiscounts.${index}.appliedDate`)}
                            />
                        </div>
                        <Button
                            type="button"
                            color="red"
                            className="mt-2"
                            onClick={() => form.removeListItem('appliedDiscounts', index)}
                        >
                            Remove Discount
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    className="mt-4"
                    onClick={() => form.insertListItem('appliedDiscounts', {
                        discount: {discountprocent: 0, name: '', expioringdate: new Date()},
                        appliedDate: new Date()
                    })}
                >
                    Add Discount
                </Button>
            </Fieldset>

            <Fieldset legend="Extras">
                    {form.values.extras.map((_, index) => (
                        <div key={index} className="border p-4 mb-4 rounded">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Extra Type"
                                    data={Object.values(Extrastype)}
                                    {...form.getInputProps(`extras.${index}.type`)}
                                />
                                <NumberInput
                                    label="Price"
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
        }
    }
    return (
        <Group className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Create New Accommodation</h2>

            <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">

                {stepcontent()}

                <Group justify="center">
                {step > 1 && (

                    <Button
                    type="button"

                    onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))} // Prevents step from going below 1
                >
                    Previous
                </Button>
                )}

                {step === 5 ? (
                    <Button type="submit"   className="">
                        Create Accommodation
                    </Button>
                ):
                (
                <Button
                    type="button"
                    className=""
                    onClick={() => setActiveStep((prev) => Math.min(6, prev + 1))} // Prevents step from going above 6
                >
                    Next
                </Button>
                    ) }
                </Group>
            </form>
        </Group>
    );
}