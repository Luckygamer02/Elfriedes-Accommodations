"use client"

import Navbar from '@/components/NavbarElements/navbar';
import Footer from '@/components/layout/Footer';
import {useSubscribeToPushNotifications} from '@/lib/hooks/useSubscribeToPushNotifications';
import {AppShell, Burger, Group} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import React, {useEffect} from 'react';
import LandingContainer from "@/components/LandingPage/LandingContainer";

export default function Layout({children}: { children: React.ReactNode }) {
    const [opened, {toggle}] = useDisclosure(false);

    const {subscribe, subscription} = useSubscribeToPushNotifications();

    useEffect(() => {
        if (!subscription) {
            subscribe()
        }
    }, [subscription, subscribe])

    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {desktop: true, mobile: !opened}}}
            //padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" className='w-full max-w-screen-xl mx-auto'>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="md"/>
                    <Navbar className='hidden md:flex justify-center align-center w-full max-w-screen-xl mx-auto'/>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Navbar className='flex md:hidden w-full' orientation="vertical"/>
            </AppShell.Navbar>

            <AppShell.Main>
                <div className="flex flex-col min-h-[calc(100vh-60px)]">
                    <div className="flex-1">
                        <LandingContainer className="py-8">
                        {children}
                        </LandingContainer>
                    </div>
                </div>

                <Footer/>
            </AppShell.Main>

        </AppShell>
    )
}