import './globals.css';
import React from "react";
import MainLayout from "../Layouts/MainLayout";

const metadata = {
    title: 'Admin Dashboard', description: 'Next.js Admin Dashboard with Ant Design'
};

export default function RootLayout({children}) {
    return (<html lang="en">
        <body>
            <MainLayout>{children}</MainLayout>
        </body>
        </html>
    );
}

export {metadata};