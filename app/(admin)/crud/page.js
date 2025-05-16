'use client';
import React, {useState} from 'react';
import {Card, message, Divider, Typography, Space} from 'antd';
import CrudTable from '@/components/CrudTable';
import {useTitleContext} from "@/components/TitleContext";
import {DatabaseOutlined, TableOutlined} from "@ant-design/icons";
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
    
    const customUserColumns = [
        {
            title: 'ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 100,
            fixed: 'left',
            form:{
                type: 'text',
                rules: [
                    {required: true, message: 'Please input your ID!'},
                    {min: 3, message: 'ID must be at least 3 characters!'},
                    {max: 10, message: 'ID must be at most 10 characters!'}
                ]
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            form: {
                type: 'text',
                rules: [
                    {required: true, message: 'Please input your name!'},
                    {min: 3, message: 'Name must be at least 3 characters!'},
                    {max: 50, message: 'Name must be at most 50 characters!'}
                ]
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            form: {
                type: 'email',
                rules: [
                    {required: true, message: 'Please input your email!'},
                    {type: 'email', message: 'The input is not valid E-mail!'}
                ]
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            form: {
                type: {
                    type: 'select', // or checkbox or radio
                    options: [
                        {label: 'Active', value: 'active'},
                        {label: 'Inactive', value: 'inactive'},
                        {label: 'Pending', value: 'pending'}
                    ]
                },
                rules: [
                    {required: true, message: 'Please select a status!'}
                ]
            }
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            form: {
                type: 'date',
                rules: [
                    {required: true, message: 'Please select a date!'}
                ]
            },
            render: (text) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            form: {
                type: 'tags',
                options: [
                    {label: 'Admin', value: 'Admin'},
                    {label: 'Manager', value: 'Manager'},
                    {label: 'User', value: 'User'}
                ],
                rules: [
                    {required: true, message: 'Please select a role!'}
                ]
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            form: {
                type: 'textArea',
                rules: [
                    {required: true, message: 'Please input a description!'},
                    {min: 10, message: 'Description must be at least 10 characters!'},
                    {max: 200, message: 'Description must be at most 200 characters!'}
                ]
            },
            render: (text) => {
                return <Text>{text}</Text>;
            }
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
                                key: 'date',
                            }
                        ]}
                    />
                </div>
            </div>
        </Card>
    );
}