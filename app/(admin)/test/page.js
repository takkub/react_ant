'use client';
import React from "react";
import { useTitleContext } from '@/components/TitleContext';
import {UserOutlined} from "@ant-design/icons";

export default function TestPage() {
    useTitleContext({title: 'Fuck',icon: <UserOutlined />});
    return (
        <div>
            <h1>Test</h1>
            <p>Welcome to the dashboard!</p>
        </div>
    );
}