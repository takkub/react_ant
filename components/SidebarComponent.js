import { Layout, Menu } from "antd";
import { DashboardOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image'
import {useTranslation} from "react-i18next";

const { Sider } = Layout;

export default function SidebarComponent({ collapsed, setCollapsed }) {
    const {t} = useTranslation();
    const { data: session, status } = useSession();
    const [logoDetail, setLogoDetail] = useState({
        path: "/assets/wsol-logo.png",
        width: "110",
        height: "32"
    })
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (!collapsed) {
            setLogoDetail({
                path: "/assets/wsol-logo.png",
                width: "110",
                height: "32"
            })
        } else {
            setLogoDetail({
                path: "/assets/wsol-logo2.png",
                width: "32",
                height: "32"
            })
        }
    }, [collapsed])

    if (status === 'unauthenticated') return null;

    if (status === 'loading') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                Loading...
            </div>
        );
    }

    const items = [
        {
            key: '1',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => router.push('/dashboard')
        },
        {
            key: '2',
            icon: <UserOutlined />,
            label: 'Users',
            onClick: () => router.push('/test')
        },
        {
            key: '3',
            icon: <SettingOutlined />,
            label: 'Settings',
            children: [
                { key: 'setting1', label: 'Sub Setting', icon: <SettingOutlined />, },
            ]
        },
        {
            key: '4',
            icon: <LogoutOutlined />,
            label: t('UserManagement'),
            children: [
                { key: 'users', label: 'Users', icon: <SettingOutlined /> },
                { key: 'roles', label: 'Roles', icon: <SettingOutlined /> },
                { key: 'permissions', label: 'Permissions', icon: <SettingOutlined /> },
            ],
            onClick: () => router.push('/user-management')
        }
    ];

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
        >
            <div style={{
                height: 32,
                margin: 16,
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }}>
                <div style={{ color: "black" }} onClick={() => router.push('/')}>
                    {/* {session?.user?.username || 'ADMIN'} */}
                    <Image src={logoDetail.path} alt="test-logo" width={logoDetail.width} height={logoDetail.height}/>
                </div>
            </div>
            <Menu
                defaultSelectedKeys={['1']}
                mode="inline"
                items={items}
            />
        </Sider>
    )
}
