'use client';

import React, {useEffect, useState} from 'react';
import httpClient from '@/lib/httpClient';

import { Festival, FestivalType } from '@/models/accommodation/accommodation';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import {
    TextInput,
    Select,
    Button,
    Group,
    Stack,
    Title,
    Card,
    Text,
    Box,
    Loader,
    Input,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import {useFestivals} from "@/components/upload/form";

// 1) Zod schema for create-festival
const festivalSchema = z
    .object({
        name: z.string().min(1),
        festivalType: z.nativeEnum(FestivalType),
        startDate: z.date(),
        endDate: z.date(),
    })
    .refine(
        (data) => data.endDate >= data.startDate,
        {
            path: ['endDate'],               // show the error under endDate
            message: 'End date must be on or after start date',
        }
    );

type FestivalFormValues = z.infer<typeof festivalSchema>;

export default function UploadFestivalPage() {
    const { festivals, isLoading, isError, revalidate } = useFestivals();
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const form = useForm<FestivalFormValues>({
        initialValues: {
            name: '',
            festivalType: FestivalType.ROCK,
            startDate: new Date(),
            endDate: new Date(),
        },
        validate: zodResolver(festivalSchema),
    });


    const handleSubmit = async (values: FestivalFormValues) => {
        try {
            if (!dateRange?.[0] || !dateRange?.[1]) {
                showNotification({
                    title: 'Error',
                    message: 'Please select both start and end dates',
                    color: 'red'
                });
                return;
            }
            // format dates as YYYY-MM-DD strings
            const payload = {
                name: values.name,
                festivalType: values.festivalType,
                startDate: dateRange[0].toISOString().split('T')[0],
                endDate: dateRange[1].toISOString().split('T')[0],
            };
            await httpClient.post<Festival>('/api/festivals', payload);
            showNotification({ title: 'Success', message: 'Festival created', color: 'green' });
            form.reset();
            revalidate();
        } catch (err) {
            console.error(err);
            showNotification({ title: 'Error', message: 'Could not create festival', color: 'red' });
        }
    };

    return (
        <Box p="xl" maw={600} mx="auto">
            <Title order={2} mb="lg">Upload Festival</Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput
                        label="Festival Name"
                        placeholder="My Summer Fest"
                        withAsterisk
                        {...form.getInputProps('name')}
                    />

                    <Select
                        label="Festival Type"
                        placeholder="Pick one"
                        data={Object.values(FestivalType).map((t) => ({ value: t, label: t }))}
                        withAsterisk
                        {...form.getInputProps('FestivalType')}
                    />


                    {/* bind directly to form */}
                    <DatePicker
                        type="range"
                        value={dateRange}
                        onChange={(range) => {
                            setDateRange(range);
                            // Update form values when dates change
                            if (range?.[0]) form.setFieldValue('startDate', range[0]);
                            if (range?.[1]) form.setFieldValue('endDate', range[1]);
                        }}
                        minDate={new Date()}
                        numberOfColumns={1}
                        allowSingleDateInRange
                    />

                    <Group p="right" mt="md">
                        <Button type="submit">Create Festival</Button>
                    </Group>
                </Stack>
            </form>

            <Box mt="xl">
                <Title order={3} mb="sm">Existing Festivals</Title>
                {isLoading && <Loader /> }
                {isError && <Text c="red">Failed to load festivals.</Text>}
                {!isLoading && festivals?.length === 0 && <Text>No festivals yet.</Text>}
                <Stack>
                    {festivals?.map((f) => (
                        <Card key={f.id} shadow="sm" p="md">
                            <Title order={4}>{f.name}</Title>
                            <Text>Type: {f.festivalType}</Text>
                            <Text>
                                {new Date(f.startDate).toLocaleDateString()} –{' '}
                                {new Date(f.endDate).toLocaleDateString()}
                            </Text>
                        </Card>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
