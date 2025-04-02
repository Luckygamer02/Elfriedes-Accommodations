import {cn} from "@/lib/utils";
import React from "react";
import Logo from "./logo";
import Container from "./container";
import {useAuthGuard} from "@/lib/auth/use-auth";
import {UserNavComponent} from "@/components/userNavComponent";
import {AccommodationNav} from "@/components/accommodationNav";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
}

export default function Navbar({ className, ...props }: NavbarProps) {
    const { user } = useAuthGuard({ middleware: "guest" });

    return (
        <div className={cn(className)} {...props}>
            <Container
                size="xl"
                className={cn(
                    "flex justify-between items-center bg-card py-2 px-4 z-10",
                    props.orientation === "vertical" ? "flex-col" : "flex-row"
                )}
            >
                <Logo/>
                <AccommodationNav user={user}/>
                <UserNavComponent user={user}/>
            </Container>
        </div>
    );
}