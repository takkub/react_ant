'use client';
import { SessionProvider } from 'next-auth/react';
import {ConfigProvider} from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React from "react";
import { lightTheme } from "../theme/theme";
export default function LoginLayout({ children }) {
    return (
        <ConfigProvider theme={lightTheme}>
            <AntdRegistry>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </AntdRegistry>
        </ConfigProvider>
    );
}
