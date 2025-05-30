'use client';
import { SessionProvider } from 'next-auth/react';
import {ConfigProvider} from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React from "react";
import { WSOLTheme, darkTheme } from "../theme/theme";
import { useTheme } from '@/store/context/ThemeContext';
export default function LoginLayout({ children }) {
    const { theme } = useTheme();
    return (
        <ConfigProvider theme={theme === "light" ? WSOLTheme : darkTheme}>
            <AntdRegistry>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </AntdRegistry>
        </ConfigProvider>
    );
}
