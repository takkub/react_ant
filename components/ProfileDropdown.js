import React, { useState, useEffect } from "react";
import { Dropdown, Avatar, Space, Typography } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation';

const { Text } = Typography;

export default function ProfileDropdown() {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    
    // Mocked user data - in a real app, this would come from your auth context or state
    const user = {
        name: "Admin User",
        email: "admin@example.com",
        avatar: null, // URL to avatar image if available
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogout = () => {
        // Handle logout logic here
        console.log("User logged out");
        // if (isMounted && router.isReady) {
        //     router.push("/login");
        // }
    };

    const navigateTo = (path) => {
        if (isMounted && router.isReady) {
            router.push(path);
        }
    };

    const items = [
        {
            key: "profile",
            label: "My Profile",
            icon: <UserOutlined />,
            onClick: () => navigateTo("/profile"),
        },
        {
            key: "settings",
            label: "Settings",
            icon: <SettingOutlined />,
            onClick: () => navigateTo("/settings"),
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
                    style={{ backgroundColor: !user.avatar ? "#1890ff" : undefined }}
                />
                <Text strong>{user.name}</Text>
                <DownOutlined style={{ fontSize: 12 }} />
            </Space>
        </Dropdown>
    );
}
