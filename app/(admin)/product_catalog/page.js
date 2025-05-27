'use client';
import React, {useEffect, useState} from 'react';
import {Card, message} from 'antd'; // Removed Typography, Text was unused
import CrudTable from '@/components/CrudTable';
import {useTitleContext} from "@/components/TitleContext";
import {DatabaseOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';
import api from "@/lib/api";

export default function ProductCatalog() {
    useTitleContext({title: 'Product Catalog', icon: <DatabaseOutlined/>});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const options = {
        // 1. Column Definitions (for Ant Design Table)
        columns: [
            {
                title: 'ID', // Title of the column
                dataIndex: 'id', // Key from your data record
                key: 'id', // Unique key for the column
                sorter: (a, b) => a.id - b.id, // Enable sorting for this column
                defaultSortOrder: 'descend', // Default sort order
                width: 80, // Fixed width for the column
                fixed: 'left', // Fix column to the left
                // Ant Design Table's built-in column filter (different from CrudTable's top filters)
                filters: [
                    { text: 'Even IDs', value: 'even' },
                    { text: 'Odd IDs', value: 'odd' },
                ],
                onFilter: (value, record) => { // Logic for the built-in column filter
                    if (value === 'even') return record.id % 2 === 0;
                    if (value === 'odd') return record.id % 2 !== 0;
                    return true;
                },
            },
            {
                title: 'Product Name',
                dataIndex: 'productName',
                key: 'productName',
                sorter: (a, b) => String(a.productName || '').localeCompare(String(b.productName || '')),
                ellipsis: true, // Show ellipsis if content is too long
                render: (text, record) => <a onClick={() => alert(`Clicked on ${record.productName}`)}>{text}</a>, // Custom render function
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                sorter: (a, b) => a.price - b.price,
                align: 'right', // Align content to the right
                render: (price) => `$${Number(price || 0).toFixed(2)}`, // Format price
            },
            {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
                filters: [ // Example for table's built-in category filter
                    { text: 'Electronics', value: 'Electronics' },
                    { text: 'Books', value: 'Books' },
                ],
                onFilter: (value, record) => record.category && record.category.includes(value),
            },
            {
                title: 'Stock',
                dataIndex: 'stock',
                key: 'stock',
                sorter: (a, b) => a.stock - b.stock,
                render: (stock) => (stock > 0 ? <span style={{ color: 'green' }}>In Stock ({stock})</span> : <span style={{ color: 'red' }}>Out of Stock</span>),
            },
            {
                title: 'Created At',
                dataIndex: 'createdAt',
                key: 'createdAt',
                sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
                render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '',
                responsive: ['md'], // Only show this column on medium screens and above
            },
        ],
        // 2. Form Configuration (for Add/Edit Modal)
        form: {
            settings: {
                addModalTitle: 'Add New Product', // Title for the "Add" modal
                editModalTitle: 'Edit Product Details', // Title for the "Edit" modal
                modalWidth: '70%', // Width of the modal (e.g., '500px', '60%')
                layout: 'vertical', // Form layout: 'horizontal', 'vertical', 'inline'
                labelCol: { span: 24 }, // Label column layout for 'horizontal' layout
                wrapperCol: { span: 24 }, // Input control column layout for 'horizontal' layout
                gridColumns: 2, // Number of columns for form items in a row (e.g., 1, 2, 3)
                initialValues: { // Default values for the form when adding a new record
                    stock: 100,
                    isActive: true,
                },
                style: { padding: '20px' }, // Custom style for the Form component
            },
            fields: [
                {
                    dataIndex: 'productName',
                    label: 'Product Name',
                    type: 'input', // or 'text'
                    rules: [{ required: true, message: 'Product name is required!' }, { min: 3, message: 'Must be at least 3 characters.' }],
                    cardGroup: 'groupBasic', // Assign to a card group
                    disabled: (modalMode) => modalMode === 'edit', // Disable if in 'edit' mode
                },
                {
                    dataIndex: 'description',
                    label: 'Description',
                    type: 'textArea',
                    rows: 4, // Number of rows for TextArea
                    rules: [{ maxLength: 200, message: 'Description too long (max 200 chars).' }],
                    cardGroup: 'groupBasic',
                },
                {
                    dataIndex: 'price',
                    label: 'Price',
                    type: 'number',
                    rules: [{ required: true, message: 'Price is required!' }, { type: 'number', min: 0, message: 'Price must be positive.' }],
                    cardGroup: 'groupPricing',
                },
                {
                    dataIndex: 'stock',
                    label: 'Stock Quantity',
                    type: 'number',
                    rules: [{ required: true, message: 'Stock is required!' }, { type: 'integer', message: 'Stock must be an integer.' }],
                    cardGroup: 'groupPricing',
                },
                {
                    dataIndex: 'category',
                    label: 'Category',
                    type: 'select',
                    rules: [{ required: true, message: 'Please select a category!' }],
                    options: [ // Options for the select dropdown
                        { label: 'Electronics', value: 'Electronics' },
                        { label: 'Books', value: 'Books' },
                        { label: 'Clothing', value: 'Clothing' },
                        { label: 'Home Goods', value: 'Home Goods' },
                    ],
                    showSearch: true, // Enable search within select options
                    optionFilterProp: "label", // Filter options by label
                    cardGroup: 'groupCategorization',
                },
                {
                    dataIndex: 'tags',
                    label: 'Tags',
                    type: 'tags', // Allows free-form input and selection from options
                    options: [
                        { label: 'Featured', value: 'featured' },
                        { label: 'New Arrival', value: 'new-arrival' },
                        { label: 'On Sale', value: 'on-sale' },
                    ],
                    cardGroup: 'groupCategorization',
                },
                {
                    dataIndex: 'releaseDate',
                    label: 'Release Date',
                    type: 'date',
                    format: 'YYYY-MM-DD', // Date format
                    cardGroup: 'groupDates',
                },
                {
                    dataIndex: 'promotionPeriod',
                    label: 'Promotion Period',
                    type: 'dateRange',
                    format: 'YYYY-MM-DD',
                    cardGroup: 'groupDates',
                },
                {
                    dataIndex: 'emailSupport',
                    label: 'Support Email',
                    type: 'email',
                    rules: [{ type: 'email', message: 'Invalid email format!' }],
                    cardGroup: 'groupContact',
                },
                {
                    dataIndex: 'isActive',
                    label: 'Active Status',
                    type: 'checkbox',
                    checkboxLabel: 'Is this product currently active?', // Label next to the checkbox
                    cardGroup: 'groupStatus',
                },
                {
                    dataIndex: 'productType',
                    label: 'Product Type',
                    type: 'radio',
                    options: [
                        { label: 'Physical', value: 'physical' },
                        { label: 'Digital', value: 'digital' },
                        { label: 'Service', value: 'service' },
                    ],
                    rules: [{ required: true, message: 'Product type is required.' }],
                    cardGroup: 'groupStatus',
                },
                {
                    dataIndex: 'notes',
                    label: 'Internal Notes',
                    type: 'textArea',
                    rows: 2,
                }
            ],
            cardGroupSetting: [ // Define how form fields are grouped into cards
                {
                    key: 'groupBasic',
                    title: 'Basic Information',
                    description: 'Enter the fundamental details of the product.',
                    gridColumns: 2, // Fields in this group will be in 2 columns
                    layout: 'horizontal',
                    labelCol: { span: 8 },
                    wrapperCol: { span: 16 },
                },
                {
                    key: 'groupPricing',
                    title: 'Pricing and Stock',
                    gridColumns: 1,
                },
                {
                    key: 'groupCategorization',
                    title: 'Categorization',
                },
                {
                    key: 'groupDates',
                    title: 'Important Dates',
                    gridColumns: 2,
                },
                {
                    key: 'groupContact',
                    title: 'Contact Information',
                },
                {
                    key: 'groupStatus',
                    title: 'Status',
                    gridColumns: 2,
                }
            ],
        },
        // 3. Pagination Configuration (for Ant Design Table)
        pagination: {
            pageSize: 10, // Default number of items per page
            showSizeChanger: true, // Allow user to change page size
            pageSizeOptions: ['5', '10', '20', '50', '100'], // Options for page size
            showQuickJumper: true, // Allow user to jump to a specific page
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, // Custom total text
        },
        // 4. Filters Configuration (for CrudTable's top filter bar)
        filters: {
            fields: [
                {
                    title: 'Search All Text', // Display title for the filter
                    field: ['productName', 'description', 'category'], // Data fields to search within (for 'text' type)
                    type: 'text', // Filter type: 'text', 'select', 'dateRange'
                    placeholder: 'Search by name, desc, category...',
                },
                {
                    title: 'Filter by Category',
                    field: 'category',
                    type: 'select',
                    options: [
                        { label: 'All Categories', value: '' },
                        { label: 'Electronics', value: 'Electronics' },
                        { label: 'Books', value: 'Books' },
                        { label: 'Clothing', value: 'Clothing' },
                        { label: 'Home Goods', value: 'Home Goods' },
                    ],
                    placeholder: 'Select category',
                },
                {
                    title: 'Filter by Release Date',
                    field: 'releaseDate',
                    type: 'dateRange',
                    format: 'YYYY-MM-DD',
                },
                {
                    title: 'Filter by Status',
                    field: 'isActive',
                    type: 'select',
                    options: [
                        { label: 'Any Status', value: null},
                        { label: 'Active', value: true },
                        { label: 'Inactive', value: false },
                    ],
                    placeholder: 'Select status',
                }
            ],
        }
    }
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('product_catalog');
                console.log('API response:', response);
                if (response.data && response.data.length > 0) {
                    setData(response.data);
                } else {
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
            const res = await api.post('product_catalog', newRecord);
            setData([...data, res.data]);
            message.success(`New record added successfully`);
        } catch (error) {
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
                await api.put(`product_catalog`, {body: updatedRecord, where: {id: key}});
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
            await Promise.all(keys.map(key => api.delete(`product_catalog`, {id: key})));
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
            
            const blob = new Blob([csvString], {type: 'text/csv;charset=utf-8;'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `product_catalog-export-${dayjs().format('YYYY-MM-DD')}.csv`);
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
                title="Product Catalog"
                data={data}
                onAdd={handleAdd(data, setData)}
                onEdit={handleEdit(data, setData)}
                onDelete={handleDelete(data, setData)}
                onExport={handleExport()}
                loading={loading}
                customColumns={options}
                rowkeys={['id']}
            />
        </Card>
    );
}

