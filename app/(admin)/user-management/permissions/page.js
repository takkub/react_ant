'use client';
import React, { useEffect, useState } from 'react';
import { Card, message, Typography } from 'antd';
import CrudTable from '@/components/CrudTable';
import { useTitleContext } from "@/components/TitleContext";
import { DatabaseOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import api from "@/lib/api";

const { Text } = Typography;

export default function PermissionsManagement() {
    useTitleContext({ title: 'Permissions', icon: <DatabaseOutlined /> });
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const options = {
        columns: [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                
                
                
                form: {
                    type: 'input',
                    
                    rules: [
                        { required: true, message: 'Please input Name!' }
                    ]
                }
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                
                
                
                form: {
                    type: 'textArea',
                    
                    rules: [
                    
                    ]
                }
            },
            {
                title: 'Access',
                dataIndex: 'access',
                key: 'access',
                
                
                
                form: {
                    type: 'tags',
                    options: [
                        { label: 'Active', value: 'active' },
                        { label: 'InActive', value: 'Inactive' }
                    ],
                    rules: [
                        { required: true, message: 'Please input Access!' }
                    ]
                }
            }
        ],
        form: {
            settings: {
                title: 'Permissions Management',
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
                layout: 'horizontal'
            },
            fields: [
                {
                    dataIndex: 'name',
                    type: 'input',
                    
                    rules: [
                        { required: true, message: 'Please input Name!' }
                    ]
                },
                {
                    dataIndex: 'description',
                    type: 'textArea',
                    
                    rules: [
                    
                    ]
                },
                {
                    dataIndex: 'access',
                    type: 'tags',
                    options: [
                        { label: 'Active', value: 'active' },
                        { label: 'InActive', value: 'Inactive' }
                    ],
                    rules: [
                        { required: true, message: 'Please input Access!' }
                    ]
                }
            ]
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('userData');
                if (response.data && response.data.length > 0) {
                    setUserData(response.data);
                } else {
                    console.log('No data from API, using sample data');
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to fetch user data. Please try again later.');
                message.error('Failed to fetch user data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleAdd = async (newRecord) => {
        try {
            const res = await api.post('userData', newRecord);
            setUserData([...userData, res.data]);
            message.success('New record added successfully');
            return true;
        } catch (error) {
            console.error('Error adding record:', error);
            message.error('Failed to add record');
            return false;
        }
    };
    
    const handleEdit = async (key, updatedRecord) => {
        try {
            const res = await api.put(`userData/${key}`, updatedRecord);
            setUserData(userData.map(record => record.id === key ? res.data : record));
            message.success('Record updated successfully');
            return true;
        } catch (error) {
            console.error('Error updating record:', error);
            message.error('Failed to update record');
            return false;
        }
    };
    
    const handleDelete = async (keys) => {
        try {
            await Promise.all(keys.map(key => api.delete(`userData/${key}`)));
            setUserData(userData.filter(record => !keys.includes(record.id)));
            message.success('Record(s) deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting record:', error);
            message.error('Failed to delete record(s)');
            return false;
        }
    };
    
    return (
        <Card>
            <CrudTable
                title="Permissions Management"
                data={userData}
                setData={setUserData}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
                customColumns={options}
                rowkeys={['id']}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
}