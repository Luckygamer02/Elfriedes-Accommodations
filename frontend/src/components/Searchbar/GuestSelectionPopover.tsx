// components/Searchbar/GuestSelectionPopover.tsx
'use client';
import React from 'react';
import {ActionIcon, Box, Button, Group, NumberInput, Popover, Stack, Text,} from '@mantine/core';
import {IconMinus, IconPlus} from '@tabler/icons-react';

interface GuestSelectionPopoverProps {
    adults: number;
    children: number;
    rooms: number;
    onChange: (values: { adults: number; children: number; rooms: number }) => void;
}

export default function GuestSelectionPopover({
                                                  adults,
                                                  children: childrenCount,
                                                  rooms,
                                                  onChange,
                                              }: GuestSelectionPopoverProps) {
    const [opened, setOpened] = React.useState(false);

    const handleChange = (field: 'adults' | 'children' | 'rooms', value: number) => {
        onChange({adults, children: childrenCount, rooms, [field]: value});
    };

    const totalPeople = adults + childrenCount;
    const label = `${totalPeople} ${totalPeople === 1 ? 'person' : 'people'}, ${rooms} ${rooms === 1 ? 'room' : 'rooms'}`;

    return (
        <Box w={256}>
            <Popover
                opened={opened}
                onChange={setOpened}
                width={300}
                position="bottom"
                withArrow
                shadow="md"
            >
                <Popover.Target>
                    <Button
                        onClick={() => setOpened((o) => !o)}
                        variant="default"
                        fullWidth
                        justify="space-between"
                        rightSection={opened ? '▲' : '▼'}
                    >
                        {label}
                    </Button>
                </Popover.Target>

                <Popover.Dropdown>
                    <Stack gap="md">
                        {(['adults', 'children', 'rooms'] as const).map((field) => (
                            <Group justify="space-between" align="center" key={field}>
                                <Text size="sm" fw={500} w={96}>
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </Text>
                                <Group gap="xs" align="center">
                                    <ActionIcon
                                        variant="default"
                                        onClick={() => handleChange(field, Math.max(0, field === 'rooms' ? rooms - 1 : field === 'adults' ? adults - 1 : childrenCount - 1))}
                                        disabled={field === 'rooms' ? rooms === 0 : field === 'adults' ? adults === 0 : childrenCount === 0}
                                        size="md"
                                        radius="xl"
                                    >
                                        <IconMinus size={16}/>
                                    </ActionIcon>

                                    <NumberInput
                                        value={field === 'adults' ? adults : field === 'children' ? childrenCount : rooms}
                                        onChange={(val) => handleChange(field, Number(val))}
                                        hideControls
                                        min={0}
                                        max={20}
                                        w={48}
                                        styles={{input: {textAlign: 'center'}}}
                                    />

                                    <ActionIcon
                                        variant="default"
                                        onClick={() => handleChange(field, (field === 'adults' ? adults : field === 'children' ? childrenCount : rooms) + 1)}
                                        size="md"
                                        radius="xl"
                                    >
                                        <IconPlus size={16}/>
                                    </ActionIcon>
                                </Group>
                            </Group>
                        ))}

                        <Button
                            color="violet"
                            fullWidth
                            onClick={() => setOpened(false)}
                            mt="md"
                        >
                            Apply
                        </Button>
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        </Box>
    );
}