import './globals.css';
import React from "react";
import { TitleProvider } from "@/components/TitleContext";
import NetworkStatusNotifier from "@/components/NetworkStatusNotifier";
import { ThemeProvider } from "../store/context/ThemeContext";
import { AntdRegistry } from '@ant-design/nextjs-registry';


export const metadata = {
    title: 'Admin Dashboard',
    description: 'Next.js Admin Dashboard with Ant Design'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <NetworkStatusNotifier />
                <ThemeProvider>
                <AntdRegistry>
                  <TitleProvider>
                      {children}
                  </TitleProvider>
                </AntdRegistry>
                </ThemeProvider>
            </body>
        </html>
    );
}
