'use client';
import React, { useState, useRef } from 'react';
import {
    Card,
    Table,
    Input,
    Button,
    Space,
    DatePicker,
    Tag,
    Tooltip,
    message,
    Flex,
    Select,
    Form,
    Modal,
    Popconfirm, Dropdown
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    FilterOutlined,
    EyeOutlined,
    ExportOutlined,
    DownOutlined
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

export default function CrudTable({
    data = [],
    setData,
    customColumns = [],
    onAdd,
    onEdit,
    onDelete,
    onExport,
    formFields = [],
    expandable = true,
    selectable = true,
    customFilters = true,
    filters = [], // New prop for custom filters
}) {
    // State for search functionality
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    
    // State for table
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        },
        sorter: {
            field: 'createdAt',
            order: 'descend',
        },
        filters: {},
        loading: false,
    });
    
    // State for selected rows
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    
    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    
    // Search handler
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    
    // Reset search handler
    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText('');
        confirm();
    };
    
    // Get column search props
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters, confirm)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    
    // Generate columns dynamically from data
    const generateColumnsFromData = () => {
        if (!data || data.length === 0) return [];
        
        // Get sample data from first item
        const sampleData = data[0];
        const keys = Object.keys(sampleData).filter(key => key !== 'key');
        
        return keys.map(key => {
            const value = sampleData[key];
            const valueType = value !== null ? typeof value : 'null';
            const isDateObject = value instanceof Date;
            const isArray = Array.isArray(value);
            
            // Basic column configuration
            const column = {
                title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
                dataIndex: key,
                key: key,
                ...getColumnSearchProps(key),
            };
            
            // Add specific configurations based on data type
            if (key === 'id') {
                column.width = 120;
                column.fixed = 'left';
            }
            
            // Configure based on data type
            if (valueType === 'string') {
                column.sorter = (a, b) => a[key]?.localeCompare(b[key]);
                
                // Add filters for string columns if less than 20 unique values
                const uniqueValues = [...new Set(data.map(item => item[key]))];
                if (uniqueValues.length < 20) {
                    column.filters = uniqueValues.map(value => ({ text: value, value }));
                    column.onFilter = (value, record) => record[key] === value;
                }
                
                // Special rendering for status-like fields
                if (key === 'status' || key.includes('status')) {
                    column.render = (status) => {
                        if (!status) return null;
                        let color;
                        const statusLower = status.toLowerCase();
                        if (statusLower.includes('active')) color = 'green';
                        else if (statusLower.includes('inactive')) color = 'gray';
                        else if (statusLower.includes('pending')) color = 'orange';
                        else if (statusLower.includes('archived')) color = 'blue';
                        else if (statusLower.includes('error')) color = 'red';
                        else if (statusLower.includes('success')) color = 'green';
                        else if (statusLower.includes('warning')) color = 'orange';
                        else color = 'default';
                        
                        return <Tag color={color}>{status.toUpperCase()}</Tag>;
                    };
                }
            } else if (valueType === 'number') {
                column.sorter = (a, b) => a[key] - b[key];
                
                // Format currency if the key suggests it's a monetary value
                if (key.includes('amount') || key.includes('price') || key.includes('cost')) {
                    column.render = (value) => `$${Number(value).toFixed(2)}`;
                }
            } else if (isDateObject || (valueType === 'string' && Date.parse(value))) {
                column.sorter = (a, b) => {
                    const dateA = a[key] instanceof Date ? a[key] : new Date(a[key]);
                    const dateB = b[key] instanceof Date ? b[key] : new Date(b[key]);
                    return dateA - dateB;
                };
                column.render = (date) => date ? (date instanceof Date ? date.toLocaleDateString() : new Date(date).toLocaleDateString()) : '';
                
                // Add date range filter
                column.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                    <div style={{ padding: 8 }}>
                        <DatePicker.RangePicker
                            value={selectedKeys[0]}
                            onChange={(dates) => setSelectedKeys(dates ? [dates] : [])}
                            style={{ marginBottom: 8, display: 'block' }}
                        />
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => confirm()}
                                icon={<SearchOutlined />}
                                size="small"
                                style={{ width: 90 }}
                            >
                                Search
                            </Button>
                            <Button
                                onClick={() => {
                                    clearFilters();
                                    confirm();
                                }}
                                size="small"
                                style={{ width: 90 }}
                            >
                                Reset
                            </Button>
                        </Space>
                    </div>
                );
                column.filterIcon = (filtered) => (
                    <FilterOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
                );
            } else if (isArray) {
                // Configure for array fields (like tags)
                column.render = (items) => {
                    if (!items || !items.length) return null;
                    
                    return (
                        <>
                            {items.map((item, index) => {
                                let color = item.length > 5 ? 'geekblue' : 'green';
                                if (item === 'urgent') color = 'red';
                                if (item === 'pending') color = 'orange';
                                return (
                                    <Tag color={color} key={`${item}-${index}`}>
                                        {item.toUpperCase()}
                                    </Tag>
                                );
                            })}
                        </>
                    );
                };
                
                // Add filters if we have tag-like arrays
                const allValues = [...new Set(data.flatMap(item => item[key] || []))];
                if (allValues.length < 20) {
                    column.filters = allValues.map(value => ({ text: value, value }));
                    column.onFilter = (value, record) => record[key]?.includes(value);
                }
            }
            
            return column;
        });
    };
    
    // Get default columns from data if available, otherwise use empty array
    const defaultColumns = generateColumnsFromData();
    
    // Add action column
    const actionColumn = {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 150,
        render: (_, record) => (
            <Space size="small">
                <Tooltip title="View">
                    <Button
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => message.info(`Viewing ${record.id}`)}
                    />
                </Tooltip>
                <Tooltip title="Edit">
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                </Tooltip>
                <Tooltip title="Delete">
                    <Popconfirm
                        title="Delete this item"
                        description="Are you sure you want to delete this item?"
                        onConfirm={() => handleDeleteSingle(record.key)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Tooltip>
            </Space>
        ),
    };
    
    // Use custom columns if provided, otherwise use dynamically generated columns
    const columns = customColumns.length > 0 
        ? [...customColumns, actionColumn] 
        : [...defaultColumns, actionColumn];
    
    // Handle table change (pagination, filters, sorter)
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            ...tableParams,
            pagination,
            filters,
            sorter: { field: sorter.field, order: sorter.order },
        });
        
        // In a real app, you would fetch data from server here
        console.log('Table params changed:', { pagination, filters, sorter });
    };
    
    // Handle row selection change
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    
    // Row selection config
    const rowSelection = selectable ? {
        selectedRowKeys,
        onChange: onSelectChange,
    } : undefined;
    
    // Handle delete selected rows
    const handleDeleteSelected = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select rows to delete');
            return;
        }
        
        Modal.confirm({
            title: 'Delete Selected Items',
            content: `Are you sure you want to delete ${selectedRowKeys.length} selected items?`,
            onOk: () => {
                // Delete selected items
                const newData = data.filter(item => !selectedRowKeys.includes(item.key));
                if (typeof onDelete === 'function') {
                    onDelete(selectedRowKeys);
                }
                if (typeof setData === 'function') {
                    setData(newData);
                }
                setSelectedRowKeys([]);
                message.success(`${selectedRowKeys.length} items deleted successfully`);
            },
        });
    };
    
    // Handle delete single row
    const handleDeleteSingle = (key) => {
        if (typeof onDelete === 'function') {
            onDelete([key]);
        }
        if (typeof setData === 'function') {
            const newData = data.filter(item => item.key !== key);
            setData(newData);
        }
        message.success('Item deleted successfully');
    };
    
    // Handle add new record
    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };
    
    // Handle edit record
    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            user: record.user,
            type: record.type,
            status: record.status,
            amount: record.amount,
            tags: record.tags,
            description: record.description,
            ...record
        });
        setIsModalOpen(true);
    };
    
    // Handle modal OK
    const handleModalOk = () => {
        form.validateFields()
        .then(values => {
            if (editingRecord) {
                // Update existing record
                const newData = [...data];
                const index = newData.findIndex(item => item.key === editingRecord.key);
                
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...values,
                    });
                    
                    if (typeof onEdit === 'function') {
                        onEdit(editingRecord.key, { ...item, ...values });
                    }
                    
                    if (typeof setData === 'function') {
                        setData(newData);
                    }
                    
                    message.success(`Record ${item.id} updated successfully`);
                }
            } else {
                // Add new record
                const newId = Math.max(...data.map(item => item.key), 0) + 1;
                const newRecord = {
                    key: newId,
                    id: `INV-${String(newId).padStart(5, '0')}`,
                    createdAt: new Date(),
                    ...values,
                };
                
                if (typeof onAdd === 'function') {
                    onAdd(newRecord);
                }
                
                if (typeof setData === 'function') {
                    setData([...data, newRecord]);
                }
                
                message.success('New record added successfully');
            }
            
            setIsModalOpen(false);
            form.resetFields();
        })
        .catch(info => {
            console.log('Validation failed:', info);
        });
    };
    
    // Handle modal cancel
    const handleModalCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    
    // Handle export
    const handleExport = () => {
        if (typeof onExport === 'function') {
            onExport(data, selectedRowKeys);
        } else {
            message.success('Exporting data...');
        }
    };
    
    // States for filters
    const [typeFilter, setTypeFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    
    // Handle filter change
    const applyFilters = () => {
        // In a real application, this would update the table data based on filters
        message.success('Filters applied');
    };
    
    // Default form fields for modal
    const defaultFormFields = [
        {
            name: "user",
            label: "User",
            type: "input",
            required: true,
            placeholder: "User name",
        },
        {
            name: "type",
            label: "Type",
            type: "select",
            required: true,
            placeholder: "Select type",
            options: [
                { label: 'Invoice', value: 'Invoice' },
                { label: 'Receipt', value: 'Receipt' },
                { label: 'Order', value: 'Order' },
                { label: 'Quote', value: 'Quote' },
                { label: 'Contract', value: 'Contract' },
            ],
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            placeholder: "Select status",
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Pending', value: 'pending' },
                { label: 'Archived', value: 'archived' },
            ],
        },
        {
            name: "amount",
            label: "Amount",
            type: "number",
            required: true,
            placeholder: "0.00",
            prefix: "$",
            min: 0,
            step: 0.01,
        },
        {
            name: "tags",
            label: "Tags",
            type: "multiselect",
            placeholder: "Select tags",
            options: [
                { label: 'Urgent', value: 'urgent' },
                { label: 'Important', value: 'important' },
                { label: 'Review', value: 'review' },
                { label: 'Completed', value: 'completed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Tax', value: 'tax' },
                { label: 'Personal', value: 'personal' },
                { label: 'Business', value: 'business' },
                { label: 'Recurring', value: 'recurring' },
            ],
        },
        {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Description",
            rows: 4,
        },
    ];
    
    // Use custom form fields if provided, otherwise use default
    const fieldsToUse = formFields.length > 0 ? formFields : defaultFormFields;
    
    // Render form fields based on their type
    const renderFormField = (field) => {
        const { name, label, type, required, placeholder, options, prefix, min, step, rows } = field;
        
        const rules = required ? [{ required: true, message: `Please input ${label.toLowerCase()}!` }] : [];
        
        switch (type) {
            case 'input':
                return (
                    <Form.Item key={name} name={name} label={label} rules={rules}>
                        <Input placeholder={placeholder} prefix={prefix} />
                    </Form.Item>
                );
            case 'number':
                return (
                    <Form.Item key={name} name={name} label={label} rules={rules}>
                        <Input 
                            type="number" 
                            placeholder={placeholder} 
                            prefix={prefix}
                            min={min}
                            step={step} 
                        />
                    </Form.Item>
                );
            case 'select':
                return (
                    <Form.Item key={name} name={name} label={label} rules={rules}>
                        <Select placeholder={placeholder} options={options} />
                    </Form.Item>
                );
            case 'multiselect':
                return (
                    <Form.Item key={name} name={name} label={label} rules={rules}>
                        <Select mode="multiple" placeholder={placeholder} options={options} />
                    </Form.Item>
                );
            case 'textarea':
                return (
                    <Form.Item key={name} name={name} label={label} rules={rules}>
                        <Input.TextArea rows={rows} placeholder={placeholder} />
                    </Form.Item>
                );
            case 'datepicker':
                return (
                    <Form.Item key={name} name={name} label={label} rules={rules}>
                        <DatePicker placeholder={placeholder} style={{ width: '100%' }} />
                    </Form.Item>
                );
            default:
                return (
                    <Form.Item key={name} name={name} label={label} rules={rules}>
                        <Input placeholder={placeholder} />
                    </Form.Item>
                );
        }
    };
    return (
        <>
            <Card
                title={
                    <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                        <Space>
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add New</Button>
                            {selectable && (
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={handleDeleteSelected}
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    Delete Selected
                                </Button>
                            )}
                        </Space>
                        
                        {customFilters && (
                            <Space>
                                {filters.length > 0 ? (
                                    // Render custom filters if provided
                                    <>
                                        {filters.map((filter, index) => {
                                            if (!filter) return null;
                                            
                                            // Handle different filter types
                                            if (filter.title === 'Search') {
                                                // Search input filter
                                                return (
                                                    <Input.Search
                                                        key={`search-${index}`}
                                                        placeholder={`Search ${Array.isArray(filter.field) ? filter.field.join(', ') : (filter.field || 'all fields')}`}
                                                        style={{ width: 250 }}
                                                        allowClear
                                                        onSearch={(value) => {
                                                            // Implement search logic
                                                            message.info(`Searching for: ${value} in ${filter.field ? filter.field.join(', ') : 'all fields'}`);
                                                        }}
                                                    />
                                                );
                                            } else if (
                                                filter.title === 'Date Range' ||
                                                (Array.isArray(filter.field) && filter.field.some(f => f.includes('date') || f.includes('Date'))) ||
                                                (typeof filter.field === 'string' && (filter.field.includes('date') || filter.field.includes('Date')))
                                            ) {
                                                // Date range filter
                                                return (
                                                    <Dropdown
                                                        key={`date-${index}`}
                                                        menu={{
                                                            items: (filter.options || []).map(opt => ({
                                                                key: opt.key,
                                                                label: opt.lable || opt.label || opt.key,
                                                                onClick: () => {
                                                                    message.info(`Selected date range: ${opt.lable || opt.label || opt.key}`);
                                                                }
                                                            })),
                                                        }}
                                                        trigger={['click']}
                                                    >
                                                        <Button>
                                                            {filter.title} <DownOutlined />
                                                        </Button>
                                                    </Dropdown>
                                                );
                                            } else {
                                                // Dropdown filter
                                                return (
                                                    <Select
                                                        key={`filter-${index}`}
                                                        placeholder={filter.title}
                                                        style={{ width: 180 }}
                                                        allowClear
                                                        options={filter.options.map(opt => ({ 
                                                            label: opt.lable || opt.label, 
                                                            value: opt.value 
                                                        }))}
                                                        onChange={(value) => {
                                                            message.info(`Selected ${filter.title}: ${value}`);
                                                        }}
                                                    />
                                                );
                                            }
                                        })}
                                        <Button
                                            type="primary"
                                            icon={<FilterOutlined />}
                                            onClick={applyFilters}
                                        >
                                            Apply Filters
                                        </Button>
                                    </>
                                ) : (
                                    // Default filters if no custom filters provided
                                    <>
                                        <Select
                                            placeholder="Filter by Type"
                                            style={{ width: 150 }}
                                            allowClear
                                            options={[...new Set(data.map(item => item.type || ''))].filter(Boolean).map(type => ({ label: type, value: type }))}
                                            onChange={(value) => setTypeFilter(value)}
                                        />
                                        <Select
                                            placeholder="Filter by Status"
                                            style={{ width: 150 }}
                                            allowClear
                                            options={[
                                                { label: 'Active', value: 'active' },
                                                { label: 'Inactive', value: 'inactive' },
                                                { label: 'Pending', value: 'pending' },
                                                { label: 'Archived', value: 'archived' },
                                            ]}
                                            onChange={(value) => setStatusFilter(value)}
                                        />
                                        <DatePicker.RangePicker
                                            onChange={(dates) => setDateRange(dates)}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<FilterOutlined />}
                                            onClick={applyFilters}
                                        >
                                            Apply Filters
                                        </Button>
                                    </>
                                )}
                                <Button
                                    icon={<ExportOutlined />}
                                    onClick={handleExport}
                                >
                                    Export
                                </Button>
                            </Space>
                        )}
                    </Flex>
                }
                styles={{ padding: '0' }}
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={tableParams.pagination}
                    loading={tableParams.loading}
                    onChange={handleTableChange}
                    scroll={{ x: 1300 }}
                    size="middle"
                    bordered
                    rowSelection={rowSelection}
                    expandable={expandable ? {
                        expandedRowRender: (record) => (
                            <p style={{ margin: 0 }}>{record.description}</p>
                        ),
                        rowExpandable: (record) => record.description,
                    } : undefined}
                />
            </Card>
            
            {/* Add/Edit Modal */}
            <Modal
                title={editingRecord ? 'Edit Record' : 'Add New Record'}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={600}
                okText={editingRecord ? 'Update' : 'Create'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="recordForm"
                >
                    {fieldsToUse.map(renderFormField)}
                </Form>
            </Modal>
        </>
    );
}
