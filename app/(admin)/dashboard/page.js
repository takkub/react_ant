'use client';
import React from 'react';
import {Card, Divider, Space, Table, Tag, Typography} from 'antd';
const {Title} = Typography;
import {useTranslation} from "react-i18next";
import {DashboardOutlined} from "@ant-design/icons";

export default function DashboardPage() {
    const {t} = useTranslation('common'); // ตรงกับการตั้งค่า namespace ใน i18n.js
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, {tags}) => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            )
        }
    ];
    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer']
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser']
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            tags: ['cool', 'teacher']
        }
    ];
    return (
        <>
            <Typography>
                <Title level={3} className={'mb-5'}><DashboardOutlined /> {t('dashboard')}</Title>
                <Divider/>
            </Typography>
            <Card variant="outline">
                <Table columns={columns} dataSource={data} />
            </Card>
        </>
    )
}