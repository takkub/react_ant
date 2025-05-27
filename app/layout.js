import './globals.css';
import React from "react";
import { TitleProvider } from "@/components/TitleContext";
import NetworkStatusNotifier from "@/components/NetworkStatusNotifier";
import { ThemeProvider } from "../store/context/ThemeContext";
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'thai'],
  display: 'swap',
});


export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={prompt.className}>
                <NetworkStatusNotifier />
                <ThemeProvider>
                <TitleProvider>
                    {children}
                </TitleProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
