'use client';
import '@/app/i18n';
import { SessionProvider } from 'next-auth/react';
import { ConfigProvider, Layout } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React, { useState } from "react";
import { WSOLTheme, darkTheme } from "@/theme/theme";
import SidebarComponent from "@/components/SidebarComponent";
import HeaderComponent from "@/components/HeaderComponent";
import ContentComponent from "@/components/ContentComponent";
import MainDrawer from "@/components/MainDrawer";
import { DrawerProvider } from "../store/context/DrawerContext";
import { useTheme } from '@/store/context/ThemeContext';
export default function MainLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { theme } = useTheme();
    return (
        <ConfigProvider theme={theme === "light" ? WSOLTheme : darkTheme}>
            <AntdRegistry>
                <SessionProvider>
                    <Layout style={{ minHeight: '100vh' }}>
                        <DrawerProvider>
                            <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
                            <Layout>
                                <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} />
                                <ContentComponent>
                                    {children}
                                </ContentComponent>
                            </Layout>
                            <MainDrawer />
                        </DrawerProvider>
                    </Layout>
                </SessionProvider>
            </AntdRegistry>
        </ConfigProvider>
    );
}