'use client';
import React from 'react';
import { Card } from 'antd';
import FormBuilder from '@/components/FormBuilder';
import DndLayoutBuilder from '@/components/DndLayoutBuilder';
import { useTitleContext } from "@/components/TitleContext";
import { FormOutlined } from "@ant-design/icons";

export default function FormBuilderPage() {
    useTitleContext({ title: 'Form Builder', icon: <FormOutlined /> });

    return (
        <>
            <DndLayoutBuilder />
            <Card>
                <FormBuilder />
            </Card>
        </>
    );
}
