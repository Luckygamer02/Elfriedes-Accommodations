"use client";

import React from "react";
import {Dropzone, FileWithPath, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {ActionIcon, Card, Center, Group, Image as MantineImage, Loader, SimpleGrid, Text,} from "@mantine/core";
import {IconPhoto, IconUpload, IconX} from "@tabler/icons-react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import httpClient from "@/lib/httpClient";
import {MultipartFile} from "@/models/backend";
import {convertFileToMultipart} from "@/components/upload/form";

interface Props {
    id: string;
}

const fetcher = (url: string) =>
    httpClient.get<{ picturesurls: string[] }>(url).then((res) => res.data);

export default function UploadandDeleteImages({id}: Props) {

    // 1) Fetch full Accommodation (including picturesurls)
    const {
        data: accommodation,
        error: fetchError,
        isLoading: loadingAcc,
        mutate: refreshAcc,
    } = useSWR(
        id ? `/api/accommodations/${id}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );


    // 2) Upload mutation via generated client
    const {trigger: uploadImage, isMutating: uploading} = useSWRMutation<
        void,
        Error,
        FileWithPath
    >(
        `/api/accommodations/${id}/image`,
        async (_url, {arg: fileWithPath}) => {
            const multipart: MultipartFile = await convertFileToMultipart(fileWithPath);
            const form = new FormData();
            form.append("file", new Blob([multipart.bytes]), multipart.originalFilename);

            // <-- use patch() with explicit multipart/form-data header
            await httpClient.patch(
                `/api/accommodations/${id}/image`,
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        },
        {
            onSuccess: () => {
                refreshAcc();
            },
        }
    );


    // 3) Delete mutation
    const {trigger: deleteImage, isMutating: deleting} = useSWRMutation<
        void,
        Error,
        string
    >(
        `/api/accommodations/${id}/images`,
        async (_url, {arg: deleteUrl}) => {
            await httpClient.request<void>({method: "DELETE", url: deleteUrl});
        },
        {
            onSuccess: () => {
                refreshAcc();
            },
        }
    );
    // Drop handler
    const handleDrop = (files: FileWithPath[]) => {
        files.forEach((f) => uploadImage(f).catch(console.error));
    };


    if (loadingAcc) {
        return (
            <Center my="lg">
                <Loader/>
            </Center>
        );
    }
    if (fetchError) {
        return <Text>Error loading accommodation.</Text>;
    }

    const images = accommodation?.picturesurls || [];

    return (
        <div>
            {/* — Dropzone for Upload — */}
            <Dropzone
                onDrop={handleDrop}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                disabled={uploading}
            >
                <Group justify="center" gap="xl" mih={220} style={{pointerEvents: "none"}}>
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
                            Each file ≤ 5 MB
                        </Text>
                    </div>
                </Group>
            </Dropzone>

            {/* — Image Grid with Delete — */}
            {images.length > 0 && (
                <SimpleGrid
                    cols={{ base: 4, md: 3, sm: 2 }}
                    spacing={{ base: 'sm', md: 'sm' }}
                    mt="md"
                >
                    {images.map((url, idx) => {
                        // We don't have per-image IDs, so use index for the delete URL
                        const deleteUrl: string = `/api/accommodations/${id}/images/${idx}`;
                        return (
                            <Card key={idx} p={0} shadow="sm" style={{position: "relative"}}>
                                <MantineImage src={url} alt={`Accommodation image`}/>

                                <ActionIcon
                                    size="lg"
                                    variant="filled"
                                    color="red"
                                    style={{position: "absolute", top: 8, right: 8}}
                                    onClick={() =>
                                        deleteImage(deleteUrl).catch((err) =>
                                            console.error("Delete failed for", deleteUrl, err)
                                        )
                                    }
                                    disabled={deleting}
                                >
                                    <IconX size={18}/>
                                </ActionIcon>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            )}
        </div>
    );
}
