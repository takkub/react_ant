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
    useTitleContext({title: 'User Management', icon: <DatabaseOutlined/>});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const options = {
        columns: [
            {
                "title": "Username",
                "dataIndex": "username",
                "key": "username",
                "filterable": true
            },
            {
                "title": "Email",
                "dataIndex": "email",
                "key": "email",
                "filterable": true
            },
            {
                "title": "Role",
                "dataIndex": "role",
                "key": "role",
                "filterable": true
            }
        ],
        form: {
            settings: {
                title: 'User Management Form',
                labelCol: {span: 6},
                wrapperCol: {span: 18},
                layout: 'horizontal',
                gridColumns: 3
            },
            fields: [
                {
                    "dataIndex": "username",
                    "type": "input",
                    "rules": [
                        {
                            "required": true,
                            "message": "Please input username!"
                        },
                        {
                            "min": 3,
                            "message": "Username must be at least 3 characters!"
                        }
                    ]
                },
                {
                    "dataIndex": "email",
                    "type": "email",
                    "rules": [
                        {
                            "required": true,
                            "message": "Please input email!"
                        },
                        {
                            "type": "email",
                            "message": "Please enter a valid email!"
                        }
                    ]
                },
                {
                    "dataIndex": "role",
                    "type": "tags",
                    "rules": [
                        {
                            "required": true,
                            "message": "Please select role!"
                        }
                    ],
                    "options": [
                        {
                            "label": "Admin",
                            "value": "Admin"
                        },
                        {
                            "label": "Manager",
                            "value": "Manager"
                        },
                        {
                            "label": "User",
                            "value": "User"
                        }
                    ]
                }
            ],
            cardGroupSetting: []
        }
    }
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('user_management');
                console.log('API response:', response);
                if (response.data && response.data.length > 0) {
                    // If the API returns data with proper format
                    setData(response.data);
                } else {
                    // Keep the sample data if API doesn't return any data
                    console.log('No data from API');
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data. Please try again later.');
                message.error('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleAdd = (data, setData) => async (newRecord) => {
        try {
            const res = await api.post('user_management', newRecord);
            setData([...data, res.data]);
            message.success(`New record added successfully`);
        } catch (error) {
            // Handle error response
            console.error('Error adding record:', error);
            if (error.response && error.response.data) {
                console.error('Error details:', error.response.data);
                message.error(`Failed to add record: ${error.response.data.message}`);
            }
            message.error('Failed to add record. Please try again.');
        }
    };
    
    const handleEdit = (data, setData) => async (key, updatedRecord) => {
        try {
            const newData = [...data];
            console.log('Editing record with key:', key);
            const index = newData.findIndex(item => item.id === key);
            if (index > -1) {
                await api.put(`user_management`, {body: updatedRecord, where: { id: key }});
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
            await Promise.all(keys.map(key => api.delete(`user_management`, {id: key})));
            const newData = data.filter(item => !keys.includes(item.id));
            setData(newData);
            message.success(`${keys.length} record(s) deleted successfully`);
        } catch (error) {
            console.error('Error deleting records:', error);
            message.error('Failed to delete records. Please try again.');
        }
    };
    
    const handleExport = () => (allData, selectedKeys) => {
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
            link.setAttribute('download', `user_management-export-${dayjs().format('YYYY-MM-DD')}.csv`);
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
                data={data}
                setData={setData}
                onAdd={handleAdd(data, setData)}
                onEdit={handleEdit(data, setData)}
                onDelete={handleDelete(data, setData)}
                onExport={handleExport()}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100']
                }}
                customColumns={options}
                filters={[
                    {
                        title: 'Search',
                        field: ['name', 'description'],
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