'use client';
import '@/app/i18n';
import { SessionProvider } from 'next-auth/react';
import { ConfigProvider, Layout } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React, { useState } from "react";
import {WSOLTheme } from "@/theme/theme";
import SidebarComponent from "@/components/SidebarComponent";
import HeaderComponent from "@/components/HeaderComponent";
import ContentComponent from "@/components/ContentComponent";
import MainDrawer from "@/components/MainDrawer";
import { DrawerProvider } from "../store/context/DrawerContext";
export default function MainLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <ConfigProvider theme={WSOLTheme}>
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