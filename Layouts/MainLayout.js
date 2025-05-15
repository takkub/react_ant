'use client';
import { SessionProvider } from 'next-auth/react';
import {ConfigProvider, Layout} from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React, {useState} from "react";
import { lightTheme,darkTheme,WSOLTheme } from "../theme/theme";
import SidebarComponent from "../components/SidebarComponent";
import HeaderComponent from "../components/HeaderComponent";
import ContentComponent from "../components/ContentComponent";

export default function MainLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <ConfigProvider theme={lightTheme}>
            <AntdRegistry>
                <SessionProvider>
                    <Layout style={{minHeight: '100vh'}}>
                        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
                        <Layout>
                            <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} />
                            <ContentComponent>
                                {children}
                            </ContentComponent>
                        </Layout>
                    </Layout>
                </SessionProvider>
            </AntdRegistry>
        </ConfigProvider>
    );
}
