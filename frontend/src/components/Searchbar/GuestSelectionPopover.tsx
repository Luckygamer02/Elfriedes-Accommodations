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
                                                  children,
                                                  rooms,
                                                  onChange,
                                              }: GuestSelectionPopoverProps) {
    const [opened, setOpened] = React.useState(false);

    const inc = (field: 'adults' | 'children' | 'rooms') =>
        onChange({...{adults, children, rooms}, [field]: eval(field) + 1});
    const dec = (field: 'adults' | 'children' | 'rooms') =>
        eval(field) > 0 &&
        onChange({...{adults, children, rooms}, [field]: eval(field) - 1});

    const totalPeople = adults + children;
    const label = `${totalPeople} people, ${rooms} rooms`;

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
                                        onClick={() => dec(field)}
                                        disabled={eval(field) === 0}
                                        size="md"
                                        radius="xl"
                                    >
                                        <IconMinus size={16}/>
                                    </ActionIcon>

                                    <NumberInput
                                        value={eval(field)}
                                        onChange={(val) =>
                                            onChange({
                                                adults,
                                                children,
                                                rooms,
                                                [field]: Number(val),
                                            } as any)
                                        }
                                        hideControls
                                        min={0}
                                        max={20}
                                        w={48}
                                        styles={{input: {textAlign: 'center'}}}
                                    />

                                    <ActionIcon
                                        variant="default"
                                        onClick={() => inc(field)}
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
