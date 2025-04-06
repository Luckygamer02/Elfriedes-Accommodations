import { cn } from "@/lib/utils";
import React from "react";
import Logo from "@/components/NavbarElements/logo";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { UserNavComponent } from "@/components/NavbarElements/userNavComponent";
import { AccommodationNav } from "@/components/NavbarElements/accommodationNav";
import TopicLinksNav from "@/components/NavbarElements/topicLinksNav";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
}

export default function Navbar({
                                   className,
                                   orientation = "horizontal",
                                   ...props
                               }: NavbarProps) {
    const { user } = useAuthGuard({ middleware: "guest" });

    return (
        <div className={cn(className)} {...props}>
            <div
                className={cn(
                    "w-full flex justify-between items-center bg-card py-2 px-4 z-10",
                    // Wenn die Orientierung horizontal ist, erzwinge, dass die Inhalte nicht umbrechen
                    orientation === "vertical" ? "flex-col" : "flex-row flex-nowrap"
                )}
            >
                <Logo />
                <TopicLinksNav />
                <AccommodationNav user={user} />
                <UserNavComponent user={user} />
            </div>
        </div>
    );
}
