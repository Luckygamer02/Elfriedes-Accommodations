import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import {MantineProvider,} from "@mantine/core";
import {ThemeProvider} from "@/components/theme-provider";
import {Notifications} from '@mantine/notifications';
import {ModalsProvider} from "@mantine/modals";
import {CookieBanner} from "@/components/CookieBanner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Elfriedes Accommodations",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en"
              data-mantine-color-scheme="light"
              style={{colorScheme: 'light'}}
        >
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider>
            <MantineProvider>
                <Notifications/>
                <ModalsProvider>
                    {children}
                    <CookieBanner />
                </ModalsProvider>
            </MantineProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
