'use client';
import React, {useEffect, useState} from 'react';
import {Card, message, Typography} from 'antd';
import CrudTable from '@/components/CrudTable';
import {useTitleContext} from "@/components/TitleContext";
import {DatabaseOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';
import api from "@/lib/api";
const {Text} = Typography;

export default function BranchManagement() {
    useTitleContext({title: 'Branch Management', icon: <DatabaseOutlined/>});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const options = {
        columns: [
        {
                "title": "Branch Type",
                "dataIndex": "type",
                "key": "type",
                "filterable": true,
                "filters": [
                        {
                                "text": "branch",
                                "value": "branch"
                        },
                        {
                                "text": "main branch",
                                "value": "main_branch"
                        }
                ],
                "onFilter": (value, record) => record.type === value
        },
        {
                "title": "Status",
                "dataIndex": "status",
                "key": "status",
                "filterable": true,
                "filters": [
                        {
                                "text": "Active",
                                "value": "active"
                        },
                        {
                                "text": "Inactive",
                                "value": "inactive"
                        },
                        {
                                "text": "Pending",
                                "value": "pending"
                        }
                ],
                "onFilter": (value, record) => record.status === value
        },
        {
                "title": "Branch Code",
                "dataIndex": "branch_code",
                "key": "branch_code",
                "filterable": true
        },
        {
                "title": "Code By Revenue Department",
                "dataIndex": "code_revenue",
                "key": "code_revenue",
                "filterable": true
        },
        {
                "title": "Branch Name Th",
                "dataIndex": "branch_name_th",
                "key": "branch_name_th",
                "filterable": true
        },
        {
                "title": "Tax Number",
                "dataIndex": "tax_number",
                "key": "tax_number",
                "filterable": true
        },
        {
                "title": "Branch Name En",
                "dataIndex": "branch_name_en",
                "key": "branch_name_en",
                "filterable": true
        },
        {
                "title": "Branch Detail",
                "dataIndex": "branch_deatail",
                "key": "branch_deatail",
                "filterable": true
        },
        {
                "title": "Open Date",
                "dataIndex": "open_date",
                "key": "open_date",
                "filterable": true,
                "render": (text) => { return dayjs(text).format('YYYY-MM-DD'); },
                "sorter": true
        },
        {
                "title": "Close Date",
                "dataIndex": "close_date",
                "key": "close_date",
                "filterable": true,
                "render": (text) => { return dayjs(text).format('YYYY-MM-DD'); },
                "sorter": true
        },
        {
                "title": "Manager",
                "dataIndex": "manager",
                "key": "manager",
                "filterable": true
        },
        {
                "title": "Phone",
                "dataIndex": "phone",
                "key": "phone",
                "filterable": true
        },
        {
                "title": "Region",
                "dataIndex": "region",
                "key": "region",
                "filterable": true,
                "filters": [
                        {
                                "text": "North",
                                "value": "north"
                        },
                        {
                                "text": "Central",
                                "value": "central"
                        },
                        {
                                "text": "South",
                                "value": "south"
                        }
                ],
                "onFilter": (value, record) => record.region === value
        },
        {
                "title": "System shutdown",
                "dataIndex": "system_shutdown",
                "key": "system_shutdown",
                "filterable": true,
                "filters": [
                        {
                                "text": "Manual",
                                "value": "manual"
                        },
                        {
                                "text": "Automatic",
                                "value": "automatic"
                        }
                ],
                "onFilter": (value, record) => record.system_shutdown === value
        },
        {
                "title": "Cross Branch",
                "dataIndex": "cross_branch",
                "key": "cross_branch",
                "filterable": true,
                "filters": [
                        {
                                "text": "Yes",
                                "value": "yes"
                        },
                        {
                                "text": "No",
                                "value": "no"
                        }
                ],
                "onFilter": (value, record) => record.cross_branch === value
        },
        {
                "title": "Time System Shutdown",
                "dataIndex": "time_system_shutdown",
                "key": "time_system_shutdown",
                "filterable": true,
                "render": (text) => { return dayjs(text).format('YYYY-MM-DD'); },
                "sorter": true
        },
        {
                "title": "Tax Register",
                "dataIndex": "tax_register",
                "key": "tax_register",
                "filterable": true
        },
        {
                "title": "Company Name",
                "dataIndex": "company_name",
                "key": "company_name",
                "filterable": true
        },
        {
                "title": "Slip Header Name",
                "dataIndex": "slip_header_name",
                "key": "slip_header_name",
                "filterable": true
        },
        {
                "title": "Invoice Address",
                "dataIndex": "invoice_address",
                "key": "invoice_address",
                "filterable": true
        },
        {
                "title": "Slip Text Th",
                "dataIndex": "slip_text_th",
                "key": "slip_text_th",
                "filterable": true
        },
        {
                "title": "Slip Text En",
                "dataIndex": "slip_text_en",
                "key": "slip_text_en",
                "filterable": true
        }
],
        form: {
            settings: {
                title: 'Branch Management Form',
                labelCol: {span: 6},
                wrapperCol: {span: 18},
                layout: 'horizontal',
                gridColumns: 1
            },
            fields: [
        {
                "dataIndex": "type",
                "type": "radio",
                "rules": [],
                "options": [
                        {
                                "label": "branch",
                                "value": "branch"
                        },
                        {
                                "label": "main branch",
                                "value": "main_branch"
                        }
                ],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "status",
                "type": "select",
                "rules": [],
                "options": [
                        {
                                "label": "Active",
                                "value": "active"
                        },
                        {
                                "label": "Inactive",
                                "value": "inactive"
                        },
                        {
                                "label": "Pending",
                                "value": "pending"
                        }
                ],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "branch_code",
                "type": "input",
                "rules": [
                        {
                                "required": true,
                                "message": "Please input Branch Code!"
                        }
                ],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "code_revenue",
                "type": "input",
                "rules": [
                        {
                                "required": true,
                                "message": "Please input Code By Revenue Department!"
                        }
                ],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "branch_name_th",
                "type": "input",
                "rules": [
                        {
                                "required": true,
                                "message": "Please input Branch Name Th!"
                        }
                ],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "tax_number",
                "type": "input",
                "rules": [
                        {
                                "required": true,
                                "message": "Please input Tax Number!"
                        }
                ],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "branch_name_en",
                "type": "input",
                "rules": [
                        {
                                "required": true,
                                "message": "Please input Branch Name En!"
                        }
                ],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "branch_deatail",
                "type": "input",
                "rules": [],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "open_date",
                "type": "date",
                "rules": [],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "close_date",
                "type": "date",
                "rules": [],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "manager",
                "type": "input",
                "rules": [],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "phone",
                "type": "input",
                "rules": [],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "region",
                "type": "select",
                "rules": [],
                "options": [
                        {
                                "label": "North",
                                "value": "north"
                        },
                        {
                                "label": "Central",
                                "value": "central"
                        },
                        {
                                "label": "South",
                                "value": "south"
                        }
                ],
                "cardGroup": "branch_info"
        },
        {
                "dataIndex": "system_shutdown",
                "type": "radio",
                "rules": [],
                "options": [
                        {
                                "label": "Manual",
                                "value": "manual"
                        },
                        {
                                "label": "Automatic",
                                "value": "automatic"
                        }
                ],
                "cardGroup": "branch_setting"
        },
        {
                "dataIndex": "cross_branch",
                "type": "radio",
                "rules": [],
                "options": [
                        {
                                "label": "Yes",
                                "value": "yes"
                        },
                        {
                                "label": "No",
                                "value": "no"
                        }
                ],
                "cardGroup": "branch_setting"
        },
        {
                "dataIndex": "time_system_shutdown",
                "type": "date",
                "rules": [],
                "cardGroup": "branch_setting"
        },
        {
                "dataIndex": "tax_register",
                "type": "checkbox",
                "rules": [],
                "options": [
                        {
                                "label": "Cashier",
                                "value": "cashier"
                        },
                        {
                                "label": "Shop",
                                "value": "shop"
                        }
                ],
                "cardGroup": "branch_setting"
        },
        {
                "dataIndex": "company_name",
                "type": "input",
                "rules": [
                        {
                                "required": true,
                                "message": "Please input Company Name!"
                        }
                ],
                "cardGroup": "header_printing_tax"
        },
        {
                "dataIndex": "slip_header_name",
                "type": "input",
                "rules": [
                        {
                                "required": true,
                                "message": "Please input Slip Header Name!"
                        }
                ],
                "cardGroup": "header_printing_tax"
        },
        {
                "dataIndex": "invoice_address",
                "type": "textArea",
                "rules": [
                        {
                                "required": true,
                                "message": "Please input Invoice Address!"
                        }
                ],
                "cardGroup": "header_printing_tax"
        },
        {
                "dataIndex": "slip_text_th",
                "type": "input",
                "rules": [
                        {
                                "required": true,
                                "message": "Please input Slip Text Th!"
                        }
                ],
                "cardGroup": "header_printing_tax"
        },
        {
                "dataIndex": "slip_text_en",
                "type": "input",
                "rules": [
                        {
                                "required": true,
                                "message": "Please input Slip Text En!"
                        }
                ],
                "cardGroup": "header_printing_tax"
        }
],
            cardGroupSetting: [
        {
                "key": "branch_info",
                "title": "Branch Info",
                "description": "",
                "labelCol": {
                        "span": 6
                },
                "wrapperCol": {
                        "span": 12
                },
                "layout": "horizontal",
                "gridColumns": 2
        },
        {
                "key": "branch_setting",
                "title": "Branch Setting",
                "description": "",
                "labelCol": {
                        "span": 6
                },
                "wrapperCol": {
                        "span": 12
                },
                "layout": "horizontal",
                "gridColumns": 2
        },
        {
                "key": "header_printing_tax",
                "title": "Header Printing Tax Invoices",
                "description": "",
                "labelCol": {
                        "span": 6
                },
                "wrapperCol": {
                        "span": 12
                },
                "layout": "horizontal",
                "gridColumns": 2
        }
]
        }
    }
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('branch_management');
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
            const res = await api.post('branch_management', newRecord);
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
                await api.put(`branch_management`, {body: updatedRecord, where: { id: key }});
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
            await Promise.all(keys.map(key => api.delete(`branch_management`, {id: key})));
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
            link.setAttribute('download', `branch_management-export-${dayjs().format('YYYY-MM-DD')}.csv`);
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
                title="Branch Management"
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