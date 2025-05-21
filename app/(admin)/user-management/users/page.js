'use client';
import React, {useEffect, useState} from 'react';
import {Card, message, Typography} from 'antd';
import CrudTable from '@/components/CrudTable';
import {useTitleContext} from "@/components/TitleContext";
import {DatabaseOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';
import api from "@/lib/api";
const {Text} = Typography;
export default function UserManagement() {
    useTitleContext({title: 'UserManagement', icon: <DatabaseOutlined/>});
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const options = {
        columns: [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                width: 100,
                fixed: 'left',
                filterable: true,
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                filterable: true,
                sorter: true,
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                filterable: true,
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                filters: [
                    {text: 'Active', value: 'active'},
                    {text: 'Inactive', value: 'inactive'},
                    {text: 'Pending', value: 'pending'}
                ],
                onFilter: (value, record) => record.status === value,
            },
            {
                title: 'Created Date',
                dataIndex: 'createdAt',
                key: 'createdAt',
                sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                filterType: 'date',
                render: (text) => {
                    return dayjs(text).format('YYYY-MM-DD');
                }
            },
            {
                title: 'Role',
                dataIndex: 'role',
                key: 'role',
                filters: [
                    {text: 'Admin', value: 'Admin'},
                    {text: 'Manager', value: 'Manager'},
                    {text: 'User', value: 'User'}
                ],
                onFilter: (value, record) => record.role && record.role.includes(value),
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                filterable: true,
                render: (text) => {
                    return <Text>{text}</Text>;
                }
            }
        ],
        form: {
            settings: {
                title: 'User Form',
                labelCol: {span: 6},
                wrapperCol: {span: 24},
                gridColumns: 2,
                layout: 'horizontal',
                mode: 'modal',
            },
            fields: [
                {
                    dataIndex: 'username',
                    type: 'input',
                    rules: [
                        {required: true, message: 'Please input your ID!'},
                        {min: 3, message: 'ID must be at least 3 characters!'},
                        {max: 10, message: 'ID must be at most 10 characters!'}
                    ],
                    disabled: (mode) => mode === 'edit'
                },
                {
                    dataIndex: 'email',
                    type: 'email',
                    rules: [
                        {required: true, message: 'Please input your email!'},
                        {type: 'email', message: 'The input is not valid E-mail!'}
                    ],
                    disabled: (mode) => mode === 'edit'
                },
                {
                    dataIndex: 'name',
                    type: 'input',
                    rules: [
                        {required: true, message: 'Please input your name!'},
                        {min: 3, message: 'Name must be at least 3 characters!'},
                        {max: 50, message: 'Name must be at most 50 characters!'}
                    ]
                },
                {
                    dataIndex: 'status',
                    type: 'select', // or checkbox or radio
                    options: [
                        {label: 'Active', value: 'active'},
                        {label: 'Inactive', value: 'inactive'},
                        {label: 'Pending', value: 'pending'}
                    ],
                    rules: [
                        {required: true, message: 'Please select a status!'}
                    ]
                },
                {
                    dataIndex: 'role',
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
                {
                    dataIndex: 'description',
                    type: 'textArea',
                    rules: [
                        {required: true, message: 'Please input a description!'},
                        {min: 10, message: 'Description must be at least 10 characters!'},
                        {max: 200, message: 'Description must be at most 200 characters!'}
                    ]
                }
            ]
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('userData');
                console.log('API response:', response);
                if (response.data && response.data.length > 0) {
                    // If the API returns data with proper format
                    setUserData(response.data);
                } else {
                    // Keep the sample data if API doesn't return any data
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
    
    const handleAdd = (data, setData) => async (newRecord) => {
        try {
            const res = await api.post('userData', newRecord);
            setData([...data, res.data]);
            message.success(`New record added successfully`);
        } catch (error) {
            // Handle error resfponse
            console.error('Error adding record:', error);
            if (error.response && error.response.data) {
                console.error('Error details:', error.response.data);
                message.error(`Failed to add record: ${error.response.data.message}`);
            }
            console.error('Error adding record:', error.response);
            message.error('Failed to add record. Please try again.' , error.response);
        }
    };
    
    const handleEdit = (data, setData) => async (key, updatedRecord) => {
        try {
            const newData = [...data];
            console.log('Editing record with key:', newData);
            const index = newData.findIndex(item => item.id === key);
            if (index > -1) {
                await api.put(`userData`, {body: updatedRecord,where:{ id: key }});
                newData[index] = {...newData[index], ...updatedRecord};
                setData(newData);
                message.success(`Record updated successfully`);
            }
        } catch (error) {
            console.error('Error updating record:', error);
            message.error('Failed to update record. Please try again.');
        }
    };
    
    const handleDelete = (data, setData) => async (keys) => {
        try {
            await Promise.all(keys.map(key => api.delete(`userData/`,{id:key})));
            const newData = data.filter(item => !keys.includes(item.id));
            setData(newData);
            message.success(`${keys.length} record(s) deleted successfully`);
        } catch (error) {
            console.error('Error deleting records:', error);
            message.error('Failed to delete records. Please try again.');
        }
    };
    
    const handleExport = (data) => (allData, selectedKeys) => {
        try {
            const dataToExport = selectedKeys.length > 0
                ? allData.filter(item => selectedKeys.includes(item.key))
                : allData;
            
            const headers = options.columns.map(col => col.title).join(',');
            const csvRows = dataToExport.map(item => {
                return options.columns.map(col => {
                    if (Array.isArray(item[col.dataIndex])) {
                        return `"${item[col.dataIndex].join(', ')}"`;
                    } else if (col.dataIndex === 'createdAt' && item[col.dataIndex]) {
                        return dayjs(item[col.dataIndex]).format('YYYY-MM-DD');
                    }
                    return `"${item[col.dataIndex] || ''}"`;
                }).join(',');
            });
            
            const csvString = [headers, ...csvRows].join('\n');
            
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `user-management-export-${dayjs().format('YYYY-MM-DD')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            message.success(`Exported ${dataToExport.length} records successfully`);
        } catch (error) {
            console.error('Error exporting data:', error);
            message.error('Failed to export data. Please try again.');
        }
    };
    return (
        <Card className="p-4">
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <CrudTable
                title="User Management"
                data={userData}
                setData={setUserData}
                onAdd={handleAdd(userData, setUserData)}
                onEdit={handleEdit(userData, setUserData)}
                onDelete={handleDelete(userData, setUserData)}
                onExport={handleExport(userData)}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100']
                }}
                customColumns={options}
                filters={[
                    {
                        title: 'Filter By Role',
                        field: 'role',
                        type: 'select',
                        options: [
                            {label: 'Admin', value: 'Admin'},
                            {label: 'Manager', value: 'Manager'},
                            {label: 'User', value: 'User'}
                        ]
                    },
                    {
                        title: 'Search',
                        field: ['name', 'email'],
                        type: 'text'
                    },
                    {
                        title: 'Date Range',
                        field: ['createdAt'],
                        type: 'dateRange'
                    }
                ]}
                rowkeys={['id']}
            />
        </Card>
    );
}