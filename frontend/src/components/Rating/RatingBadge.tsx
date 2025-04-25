"use client"
import useSWR from "swr";
import {IconStarFilled} from '@tabler/icons-react';
import httpClient from "@/lib/httpClient";
import {Badge} from "@mantine/core";

interface RatingBadgeProps {
    accommodationId: number;
}

export function RatingBadge({accommodationId}: RatingBadgeProps) {
    const {data: rating} = useSWR<number>(
        `api/ratings/rating/${accommodationId}`,
        () => httpClient.get<number>(`api/ratings/rating/${accommodationId}`)
            .then((res) => res.data)
    );
    return (
        <Badge leftSection={<IconStarFilled size={10}/>}>
            {rating || '--'}
        </Badge>
    );
}