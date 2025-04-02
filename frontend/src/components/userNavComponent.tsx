import {BlockingData} from "swr/_internal";
import ModeToggle from "@/components/ModeToggle";
import AdminNav from "@/components/admin-nav";
import {UserNav} from "@/components/user-nav";
import {Button} from "@mantine/core";
import Link from "next/link";
import React from "react";

export function UserNavComponent(props: { user: BlockingData<T, any> extends true ? T : (T | undefined) }) {
    return <div className="flex gap-x-2 items-center">
        <ModeToggle/>
        <AdminNav/>
        {props.user && (
            <UserNav/>
        )}
        {props.user?.authorities.includes("ROLE_PREVIOUS_ADMINISTRATOR") && (
            <a href={"/api/auth/impersonate/exit"}>
                <Button>Exit switch</Button>
            </a>
        )}

        {!props.user && (
            <Link href={"/auth/login"}>
                <Button variant={"outline"}>Login</Button>
            </Link>
        )}
    </div>;
}