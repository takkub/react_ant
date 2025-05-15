import './globals.css';
import ClientLayout from "./client-layout";
import React from "react";

const metadata = {
    title: 'Admin Dashboard',
    description: 'Next.js Admin Dashboard with Ant Design',
};

export default function RootLayout ({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ClientLayout>{children}</ClientLayout>
        </body>
        </html>
    );
}

export { metadata };