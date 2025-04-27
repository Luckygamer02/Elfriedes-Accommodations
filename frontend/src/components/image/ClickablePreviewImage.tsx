
import React from 'react';
import { Image, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function ClickablePreviewImage( {ImageURl} :{ImageURl : string}) {
    // 1. State-Management für Modal auf/zu
    const [opened, { open, close }] = useDisclosure(false);
    // 2. State für die aktuelle Bild-URL
    const [previewSrc, setPreviewSrc] = React.useState<string>('');
    const theme = useMantineTheme();

    // Handler, der Bild-URL setzt und Modal öffnet
    const handleClick = (url: string) => {
        setPreviewSrc(url);
        open();
    };

    return (
        <>
            {/* 3. Vorschaubild mit Klick-Handler */}
        <Image
        src={ImageURl}
        alt={ImageURl + " Preview"}
        radius="md"
        h={160}
        w={"auto"}
        style={{ cursor: 'pointer' }}
        onClick={() => handleClick(ImageURl)}
        />

    {/* 4. Modal für Großansicht */}
            <Modal
                opened={opened}
                onClose={close}
                withinPortal
                overlayProps={{ opacity: 0.75, blur: 3 }}
                size="auto"
                centered
            >
                <Image src={previewSrc} alt="Full Preview" fit="contain" />
            </Modal>
        </>
);
}
