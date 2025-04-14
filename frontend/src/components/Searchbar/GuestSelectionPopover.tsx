import React, { useState } from 'react';
import { Popover, Button, Group, Text, ActionIcon, NumberInput, Stack, Box } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';

export default function GuestSelectionPopover() {
    const [opened, setOpened] = useState(false);
    const [adults, setAdults] = useState(4);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(2);

    const handleIncrement = (setter, value) => {
        setter(value + 1);
    };

    const handleDecrement = (setter, value) => {
        if (value > 0) {
            setter(value - 1);
        }
    };

    const totalPeople = adults + children;
    const buttonLabel = `${totalPeople} Personen, ${rooms} Schlafzimmer`;

    return (
        <Box className="w-64">
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
                        className="w-full justify-between"
                        rightIcon={opened ? "▲" : "▼"}
                    >
                        {buttonLabel}
                    </Button>
                </Popover.Target>

                <Popover.Dropdown>
                    <Stack spacing="md">
                        <Group position="apart" className="items-center">
                            <Text size="sm" className="font-medium w-24">Erwachsene</Text>
                            <Group spacing="xs" className="items-center">
                                <ActionIcon
                                    variant="default"
                                    onClick={() => handleDecrement(setAdults, adults)}
                                    disabled={adults === 0}
                                    size="md"
                                    radius="xl"
                                >
                                    <IconMinus size={16} />
                                </ActionIcon>

                                <NumberInput
                                    value={adults}
                                    onChange={(val) => setAdults(val)}
                                    hideControls
                                    min={0}
                                    max={20}
                                    className="w-12 text-center"
                                    styles={{ input: { textAlign: 'center' } }}
                                />

                                <ActionIcon
                                    variant="default"
                                    onClick={() => handleIncrement(setAdults, adults)}
                                    size="md"
                                    radius="xl"
                                >
                                    <IconPlus size={16} />
                                </ActionIcon>
                            </Group>
                        </Group>

                        <Group position="apart" className="items-center">
                            <Text size="sm" className="font-medium w-24">Kinder</Text>
                            <Group spacing="xs" className="items-center">
                                <ActionIcon
                                    variant="default"
                                    onClick={() => handleDecrement(setChildren, children)}
                                    disabled={children === 0}
                                    size="md"
                                    radius="xl"
                                >
                                    <IconMinus size={16} />
                                </ActionIcon>

                                <NumberInput
                                    value={children}
                                    onChange={(val) => setChildren(val)}
                                    hideControls
                                    min={0}
                                    max={20}
                                    className="w-12 text-center"
                                    styles={{ input: { textAlign: 'center' } }}
                                />

                                <ActionIcon
                                    variant="default"
                                    onClick={() => handleIncrement(setChildren, children)}
                                    size="md"
                                    radius="xl"
                                >
                                    <IconPlus size={16} />
                                </ActionIcon>
                            </Group>
                        </Group>

                        <Group position="apart" className="items-center">
                            <Text size="sm" className="font-medium w-24">Schlafzimmer</Text>
                            <Group spacing="xs" className="items-center">
                                <ActionIcon
                                    variant="default"
                                    onClick={() => handleDecrement(setRooms, rooms)}
                                    disabled={rooms === 0}
                                    size="md"
                                    radius="xl"
                                >
                                    <IconMinus size={16} />
                                </ActionIcon>

                                <NumberInput
                                    value={rooms}
                                    onChange={(val) => setRooms(val)}
                                    hideControls
                                    min={0}
                                    max={20}
                                    className="w-12 text-center"
                                    styles={{ input: { textAlign: 'center' } }}
                                />

                                <ActionIcon
                                    variant="default"
                                    onClick={() => handleIncrement(setRooms, rooms)}
                                    size="md"
                                    radius="xl"
                                >
                                    <IconPlus size={16} />
                                </ActionIcon>
                            </Group>
                        </Group>

                        <Button
                            color="yellow"
                            fullWidth
                            onClick={() => setOpened(false)}
                            className="mt-4"
                        >
                            ANWENDEN
                        </Button>
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        </Box>
    );
}