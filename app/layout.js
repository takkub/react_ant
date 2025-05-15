import './globals.css';
import React from "react";
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Admin Dashboard', description: 'Next.js Admin Dashboard with Ant Design'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
    );
}
