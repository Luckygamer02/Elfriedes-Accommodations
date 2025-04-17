import React, { useState } from 'react';
import { Popover, Button, Group, Text, ActionIcon, NumberInput, Stack, Box } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';

export default function GuestSelectionPopover() {
    const [opened, setOpened] = useState(false);
    const [adults, setAdults] = useState(4);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(2);

    const handleIncrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(value + 1);
    };

    const handleDecrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        if (value > 0) {
            setter(value - 1);
        }
    };

    const totalPeople = adults + children;
    const buttonLabel = `${totalPeople} Personen, ${rooms} Schlafzimmer`;

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
                        rightSection={opened ? "▲" : "▼"}
                    >
                        {buttonLabel}
                    </Button>
                </Popover.Target>

                <Popover.Dropdown>
                    <Stack gap="md">
                        <Group justify="space-between" align="center">
                            <Text size="sm" fw={500} w={96}>Erwachsene</Text>
                            <Group gap="xs" align="center">
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
                                    onChange={(val) => setAdults(Number(val))}
                                    hideControls
                                    min={0}
                                    max={20}
                                    w={48}
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

                        <Group justify="space-between" align="center">
                            <Text size="sm" fw={500} w={96}>Kinder</Text>
                            <Group gap="xs" align="center">
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
                                    onChange={(val) => setChildren(Number(val))}
                                    hideControls
                                    min={0}
                                    max={20}
                                    w={48}
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

                        <Group justify="space-between" align="center">
                            <Text size="sm" fw={500} w={96}>Schlafzimmer</Text>
                            <Group gap="xs" align="center">
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
                                    onChange={(val) => setRooms(Number(val))}
                                    hideControls
                                    min={0}
                                    max={20}
                                    w={48}
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
                            color="violet"
                            fullWidth
                            onClick={() => setOpened(false)}
                            mt="md"
                        >
                            ANWENDEN
                        </Button>
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        </Box>
    );
}