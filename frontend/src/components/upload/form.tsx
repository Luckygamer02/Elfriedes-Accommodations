"use client"
import {
    Container,
    Title,
    TextInput,
    Textarea,
    NumberInput,
    Button,
    Group,
} from '@mantine/core';
import {useState} from "react";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import Accommodation from "@/models/accommidation/accommodation";



export default function uploadform() {
    const [activeStep, setActiveStep] = useState(0);
    const [form, setForm] = useState<Accommodation>({
        ac: false,
        city: "",
        garden: false,
        id: 0,
        images: [],
        kitchen: false,
        microwave: false,
        pool: false,
        pricedExtras: [],
        state: "",
        street: "",
        tv: false,
        userid: "",
        washingmaschine: false,
        wifi: false,
        zip: "",
        title: '',
        description: '',
        price: 0
    });
    const handleChange = (field: keyof Accommodation, value: any) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleImageUpload = (files: File[]) => {
        handleChange('images', files);
    };

    const handleSubmit= () => {
    };
    const steps = [
        {
            label: 'Base Details',
            content: (
                <>
                    <TextInput
                        label="Accommodation ID"
                        placeholder="Enter your accommodation ID"
                        value={form.id}
                        onChange={(e) => handleChange('id', e.currentTarget.value)}
                        required
                        mb="sm"
                    />
                    <TextInput
                        label="Title"
                        placeholder="e.g. Cozy city apartment"
                        value={form.title}
                        onChange={(e) => handleChange('title', e.currentTarget.value)}
                        required
                        mb="sm"
                    />
                </>
            ),
        },
        {
            label: 'Description',
            content: (
                <Textarea
                    label="Description"
                    placeholder="Describe your accommodation"
                    value={form.description}
                    onChange={(e) => handleChange('description', e.currentTarget.value)}
                    required
                    mb="sm"
                />
            ),
        },
        {
            label: 'Upload Images',
            content: (
                <Dropzone
                    onDrop={handleImageUpload}
                    onReject={(files) => console.log('Rejected files:', files)}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                >
                    <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                        <Dropzone.Idle>
                            <div>
                                <p>Drag images here or click to select files</p>
                                <p>Each file should not exceed 5MB.</p>
                            </div>
                        </Dropzone.Idle>
                    </Group>
                </Dropzone>
            ),
        },
        {
            label: 'Extras',
            content: (
                <>
                    <NumberInput
                        label="Price per night (€)"
                        placeholder="Enter your price"
                        value={form.price}
                        onChange={(value) => handleChange('price', value || 0)}
                        required
                        mb="sm"
                        min={0}
                    />
                    <TextInput
                        label="Extra Details"
                        placeholder="Optional extras, e.g. free WiFi, breakfast"
                        value={form.extras}
                        onChange={(e) => handleChange('extras', e.currentTarget.value)}
                        mb="sm"
                    />
                </>
            ),
        },
    ];

    const nextStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((current) => current + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 0) {
            setActiveStep((current) => current - 1);
        }
    };


    return (
        <form className="w-3/4" onSubmit={handleSubmit}>
            <div>
                <div>{steps[activeStep].content}</div>
            </div>
            <Group mt="md">
                <Button variant="default" onClick={prevStep} disabled={activeStep === 0}>
                    Back
                </Button>
                {activeStep < steps.length - 1 ? (
                    <Button onClick={nextStep}>Next</Button>
                ) : (
                    <Button type="submit">Submit</Button>
                )}
            </Group>
        </form>
    );
}