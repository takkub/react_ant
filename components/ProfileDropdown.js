import React, { useState, useEffect } from "react";
import { Dropdown, Avatar, Space, Typography } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined, BgColorsOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation';
import { useDrawer } from "@/store/context/DrawerContext";
import {signOut} from "next-auth/react";
import { useTheme } from "@/store/context/ThemeContext";

const { Text } = Typography;

export default function ProfileDropdown() {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const { openDrawer } = useDrawer();
    // Mocked user data - in a real app, this would come from your auth context or state
    const user = {
        name: "Admin User",
        email: "admin@example.com",
        avatar: null, // URL to avatar image if available
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };
    const navigateTo = (path) => {
        
        // if (isMounted && router.isReady) {
        if (isMounted) {
            router.push(path);
        }
    };

    const items = [
        {
            key: "profile",
            label: "My Profile",
            icon: <UserOutlined />,
            onClick: () => navigateTo("/profile"),
            // onClick: () => openDrawer({
            //     title: 'My Profile',
            //     content: (
            //         <div>
            //             <p><strong>Name:</strong> {user.name}</p>
            //             <p><strong>Username:</strong> {user.name}</p>
            //             <p><strong>Email:</strong> {user.email}</p>
            //             <p><strong>Role:</strong> Super Admin</p>
            //         </div>
            //     )
            // })
        },
        {
            key: "settings",
            label: "Settings",
            icon: <SettingOutlined />,
            onClick: () => navigateTo("/settings"),
        },
        {
            key: "theme",
            label: `Change Theme`,
            icon: <BgColorsOutlined />,
            onClick: () => toggleTheme(),
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            label: "Logout",
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <Dropdown
            menu={{ items }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
        >
            <Space style={{ cursor: "pointer" }}>
                <Avatar
                    size="small"
                    src={user.avatar}
                    icon={!user.avatar && <UserOutlined />}
                    style={{ backgroundColor: !user.avatar ? "grey" : undefined }}
                />
                <Text style={{ color: "white" }} strong>{user.name}</Text>
                <DownOutlined style={{ fontSize: 12, color: "white" }} />
            </Space>
        </Dropdown>
    );
}
