'use client';
import { SessionProvider } from 'next-auth/react';
import {ConfigProvider} from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React from "react";
import { lightTheme, WSOLTheme } from "../theme/theme";
export default function LoginLayout({ children }) {
    return (
        <ConfigProvider theme={WSOLTheme}>
            <AntdRegistry>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </AntdRegistry>
        </ConfigProvider>
    );
}
