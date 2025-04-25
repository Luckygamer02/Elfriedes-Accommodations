import {BlockingData} from "swr/_internal";
import Link from "next/link";
import {Button} from "@mantine/core";
import React from "react";

export function AccommodationNav(props: { // @ts-ignore
    user: BlockingData<T, any> extends true ? T : (T | undefined)
}) {
    return <>
        <div className="flex items-center gap-x-2 justify-between"/>
        {props.user && (
            <>
                <Link href="/accommodation/manage">
                    <Button variant={"outline"}>Manage Accommodation</Button>
                </Link>
                <Link href="/accommodation/upload">
                    <Button variant={"outline"}>Upload Accommodation</Button>
                </Link>
            </>
        )}
        <div/>
    </>;
}