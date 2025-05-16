'use client';
import React, {useState} from 'react';
import {Card, message, Alert, Divider, Typography, Space} from 'antd';
import CrudTable from '@/components/CrudTable';
import {useTitleContext} from "@/components/TitleContext";
import {DatabaseOutlined, TableOutlined, CodeOutlined, SettingOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';

// Helper functions for date filters
const getTodayDate = () => {
    return [dayjs().startOf('day'), dayjs().endOf('day')];
};

const getLastWeekDate = () => {
    return [dayjs().subtract(7, 'day'), dayjs()];
};

const { Title, Paragraph, Text } = Typography;

export default function CrudPage() {
    useTitleContext({title: 'DCE', icon: <DatabaseOutlined />});
    
    // Basic invoice data example
    const [userData, setUserData] = useState([
        {
            key: 1,
            userId: 'takkub01',
            name: 'Monchai M.',
            email: 'monchai.m@sabuytech.com',
            status: 'active',
            createdAt: new Date('2023-09-15'),
            role: ['Admin', 'Manager'],
            description: 'This is a sample invoice for business services rendered in September.'
        }
    ]);
    // Custom columns example for when you need specific column configuration
    const customUserColumns = [
        {
            title: 'ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 100,
            type: 'key',
            fixed: 'left'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            type: 'string',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            type: 'string',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            type: 'string',
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            type: 'dateRange',
            render: (text) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            type: 'tags',
        }
    ];
    
    // Generic CRUD operation handlers
    const handleAdd = (data, setData) => (newRecord) => {
        setData([...data, newRecord]);
        message.success(`New record added successfully`);
    };
    
    const handleEdit = (data, setData) => (key, updatedRecord) => {
        const newData = [...data];
        const index = newData.findIndex(item => item.key === key);
        if (index > -1) {
            newData[index] = {...newData[index], ...updatedRecord};
            setData(newData);
            message.success(`Record updated successfully`);
        }
    };
    
    const handleDelete = (data, setData) => (keys) => {
        const newData = data.filter(item => !keys.includes(item.key));
        setData(newData);
        message.success(`${keys.length} record(s) deleted successfully`);
    };
    
    const handleExport = (data) => (allData, selectedKeys) => {
        const dataToExport = selectedKeys.length > 0
            ? allData.filter(item => selectedKeys.includes(item.key))
            : allData;
        
        message.success(`Exporting ${dataToExport.length} records...`);
        console.log('Exporting data:', dataToExport);
    };
    
    return (
        <Card variant="outline">
            <div className="p-4">

                <Divider orientation="left">
                    <Space>
                        <TableOutlined />
                        <span>Basic Usage - User Management</span>
                    </Space>
                </Divider>
                
                <div className="mb-8">
                    <Paragraph>
                        This example demonstrates the basic usage of CrudTable with dynamic column generation.
                        No customColumns are provided, so the component generates them from the data structure.
                    </Paragraph>
                    
                    <CrudTable
                        title="User Management"
                        data={userData}
                        setData={setUserData}
                        onAdd={handleAdd(userData, setUserData)}
                        onEdit={handleEdit(userData, setUserData)}
                        onDelete={handleDelete(userData, setUserData)}
                        onExport={handleExport(userData)}
                        customColumns={customUserColumns}
                        filters={[
                            {
                                title: 'Filter By Role',
                                field: 'role',
                                key: 'role',
                                options: [
                                    {lable: 'Admin',key: 'Admin', value: 'Admin'},
                                    {lable: 'Manager',key: 'Manager', value: 'Manager'},
                                    {lable: 'User',key: 'User', value: 'User'}
                                ]
                            },
                            {
                                title: 'Search',
                                field: ['name', 'email'],
                                key: 'search'
                            },
                            {
                                title: 'Date Range',
                                field: ['createdAt'],
                                key: 'dateRange',
                                options: [
                                    {lable: 'This Month', key: 'thisMonth', value: 'thisMonth'},
                                    {lable: 'Last 3 Months', key: 'last3Months', value: 'last3Months'},
                                    {lable: 'Last 6 Months', key: 'last6Months', value: 'last6Months'},
                                    {lable: 'This Year', key: 'thisYear', value: 'thisYear'},
                                    {lable: 'Today', key: 'today', value: getTodayDate()},
                                    {lable: 'Last 7 days', key: 'weekly', value: getLastWeekDate()},
                                    {lable: 'This Month', key: 'thisMonth', value: [dayjs().startOf('month'), dayjs().endOf('month')]},
                                    {lable: 'This Year', key: 'thisYear', value: [dayjs().startOf('year'), dayjs().endOf('year')]}
                                ]
                            }
                            
                        ]}
                    />
                </div>
            </div>
        </Card>
    );
}