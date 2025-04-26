// src/components/Navbar.tsx
"use client";

import React from "react";
import NextLink from "next/link";
import {
    Group,
    Button,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { useAuthGuard } from "@/lib/auth/use-auth";
import ModeToggle from "@/components/ModeToggle";
import AdminNav from "@/components/NavbarElements/admin-nav";
import { UserNav } from "@/components/NavbarElements/user-nav";
import Link from "next/link";

export default function Navbar() {
    const { user } = useAuthGuard({ middleware: "guest" });
    const theme = useMantineTheme();

    return (

        <Group position="apart" align="center" sx={{ height: '100%' }} nowrap>
                {/* Brand */}
                 <Link href="/">
                    <Text
                        size="xl"
                        variant="gradient"
                        gradient={{ from: "violet", to: "cyan", deg: 90 }}
                        sx={{ textDecoration: "none", cursor: "pointer" }}
                    >
                        Elfriedes Accommodations
                    </Text>
                 </Link>

                {/* Main nav links */}


                    <Button component={Link}  href="/"  variant="subtle">
                        Home
                    </Button>

                    <Button component={Link} href="/accommodations" variant="subtle">
                        Accommodations
                    </Button>

                    {user && (
                        <>

                            <Button  component={Link} href="/accommodation/manage" variant="subtle">
                                Manage
                            </Button>
                            <Button  component={Link} href="/accommodation/upload"   variant="subtle">
                                Upload
                            </Button>

                        </>
                    )}

                    <ModeToggle />
                    <AdminNav />
                    {user ? (
                        <UserNav />
                    ) : (
                        <>
                            <Button  component={Link}  href="/auth/login" variant="outline">
                                Login
                            </Button>
                            <Button  component={Link}  href="/auth/register" >Register</Button>

                        </>
                    )}

            </Group>

    );
}
