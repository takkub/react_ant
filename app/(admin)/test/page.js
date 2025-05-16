'use client';
import React, {useEffect} from "react";
import { useTitle } from '@/components/TitleContext';
import { UserOutlined} from "@ant-design/icons";

export default function TestPage() {
    const { setTitle } = useTitle();
    useEffect(() => {
        setTitle({
            title: 'Fuck',
            icon: <UserOutlined />
        });
    }, [setTitle]);
    return (
        <div>
            <h1>Test</h1>
            <p>Welcome to the dashboard!</p>
        </div>
    );
}