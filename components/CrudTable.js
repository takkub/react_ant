'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    Table, Button, Space, Modal, Form, Input,
    Select, DatePicker, Checkbox, message, Card,
    Row, Col, Tag, Tooltip, Dropdown, Typography,
    Popconfirm, Radio
} from 'antd';
import {
    PlusOutlined, DeleteOutlined,
     SearchOutlined, EditOutlined,
    DownloadOutlined, FileExcelOutlined, FileTextOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CrudTable = ({
    title,
    data,
    setData,
    onAdd,
    onEdit,
    onDelete,
    onExport,
    loading = false,
    pagination = { pageSize: 10 },
    customColumns = { columns: [] },
    filters = [],
    rowkeys = ['key']
}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [editingKey, setEditingKey] = useState(null);
    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState({});
    const [filteredData, setFilteredData] = useState(data);
    const [searchText, setSearchText] = useState('');
    const [exportMenuVisible, setExportMenuVisible] = useState(false);
    const exportMenuRef = useRef(null);

    useEffect(() => {
        // Apply filters to data - Moving the function inside useEffect to avoid dependency warnings
        const applyFilters = () => {
            let result = [...data];
    
            // Apply filter values
            Object.entries(filterValues).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    const filter = filters.find(f => f.field === key || (Array.isArray(f.field) && f.field.includes(key)));
                    
                    if (filter) {
                        if (filter.type === 'select' || filter.type === 'radio') {
                            result = result.filter(record => {
                                if (Array.isArray(record[key])) {
                                    return record[key].includes(value);
                                }
                                return record[key] === value;
                            });
                        } else if (filter.type === 'dateRange' && Array.isArray(value) && value.length === 2) {
                            const startDate = value[0].startOf('day');
                            const endDate = value[1].endOf('day');
                            
                            result = result.filter(record => {
                                const recordDate = dayjs(record[key]);
                                return recordDate.isAfter(startDate) && recordDate.isBefore(endDate);
                            });
                        } else if (filter.type === 'text') {
                            // This should be handled by the searchText logic below
                        }
                    }
                }
            });
    
            // Apply searchText to all searchable fields
            if (searchText) {
                const searchFilters = filters.filter(f => f.type === 'text');
                const searchFields = searchFilters.flatMap(f => Array.isArray(f.field) ? f.field : [f.field]);
                
                result = result.filter(record => {
                    return searchFields.some(field => {
                        const value = record[field];
                        if (typeof value === 'string') {
                            return value.toLowerCase().includes(searchText.toLowerCase());
                        }
                        return false;
                    });
                });
            }
    
            setFilteredData(result);
        };
    
        applyFilters();
    }, [data, filterValues, searchText, filters]); // Added 'filters' to dependency array

    // Function to manually trigger filtering (accessible outside useEffect)
    const applyFiltersManually = () => {
        let result = [...data];
    
        // Apply filter values
        Object.entries(filterValues).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                const filter = filters.find(f => f.field === key || (Array.isArray(f.field) && f.field.includes(key)));
                
                if (filter) {
                    if (filter.type === 'select' || filter.type === 'radio') {
                        result = result.filter(record => {
                            if (Array.isArray(record[key])) {
                                return record[key].includes(value);
                            }
                            return record[key] === value;
                        });
                    } else if (filter.type === 'dateRange' && Array.isArray(value) && value.length === 2) {
                        const startDate = value[0].startOf('day');
                        const endDate = value[1].endOf('day');
                        
                        result = result.filter(record => {
                            const recordDate = dayjs(record[key]);
                            return recordDate.isAfter(startDate) && recordDate.isBefore(endDate);
                        });
                    } else if (filter.type === 'text') {
                        // This should be handled by the searchText logic below
                    }
                }
            }
        });
    
        // Apply searchText to all searchable fields
        if (searchText) {
            const searchFilters = filters.filter(f => f.type === 'text');
            const searchFields = searchFilters.flatMap(f => Array.isArray(f.field) ? f.field : [f.field]);
            
            result = result.filter(record => {
                return searchFields.some(field => {
                    const value = record[field];
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(searchText.toLowerCase());
                    }
                    return false;
                });
            });
        }
    
        setFilteredData(result);
    };
    
    // Reset all filters
    const resetFilters = () => {
        setFilterValues({});
        setSearchText('');
        form.resetFields();
        // Apply filters after resetting to show unfiltered data
        setTimeout(() => applyFiltersManually(), 0);
    };

    // Row selection configuration
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    // Handle form submission
    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            // Format dates if needed
            Object.keys(values).forEach(key => {
                if (values[key] instanceof dayjs) {
                    values[key] = values[key].toDate();
                }
            });
            
            if (modalMode === 'add') {
                await onAdd(values);
            } else if (modalMode === 'edit') {
                await onEdit(editingKey, values);
            }
            
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    // Show add form
    const showAddForm = () => {
        setModalMode('add');
        setEditingKey(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    // Show edit form
    const showEditForm = (record) => {
        setModalMode('edit');
        
        // Use the primary key from rowkeys if available
        let editKey = record.key;
        for (const key of rowkeys) {
            if (record[key] !== undefined && record[key] !== null) {
                editKey = record[key];
                break;
            }
        }
        
        setEditingKey(editKey);
        
        // Format date fields before setting form values
        const formValues = { ...record };
        
        // Check if form is defined before attempting to use it
        if (form) {
            // Set form values
            form.setFieldsValue(formValues);
        } else {
            console.error("Form instance is not properly initialized");
        }
        setIsModalVisible(true);
    };

    // Handle delete
    const handleDelete = async (keys) => {
        if (Array.isArray(keys) && keys.length > 0) {
            await onDelete(keys);
            setSelectedRowKeys([]);
        }
    };

    // Handle delete of a single record
    const handleDeleteSingle = async (record) => {
        // Extract key values from the record using the rowkeys
        const keys = rowkeys.map(key => record[key]).filter(val => val !== undefined);
        
        // If no keys were found, fall back to record.key
        const keyToDelete = keys.length > 0 ? keys[0] : record.key;
        
        await handleDelete([keyToDelete]);
    };

    // Handle delete of selected records
    const handleDeleteSelected = async () => {
        if (selectedRowKeys.length > 0) {
            await handleDelete(selectedRowKeys);
        } else {
            message.warning('Please select at least one record to delete');
        }
    };

    // Handle export
    const handleExport = (type) => {
        if (typeof onExport === 'function') {
            onExport(filteredData, selectedRowKeys);
            return;
        }

        const dataToExport = selectedRowKeys.length > 0
            ? filteredData.filter(item => selectedRowKeys.includes(item.key))
            : filteredData;

        if (dataToExport.length === 0) {
            message.warning('No data to export');
            return;
        }

        // Get columns
        const columns = customColumns.columns;
        
        // Prepare data for export
        const exportData = dataToExport.map(record => {
            const row = {};
            columns.forEach(col => {
                let value = record[col.dataIndex];
                
                // Format special types
                if (Array.isArray(value)) {
                    value = value.join(', ');
                } else if (col.dataIndex === 'createdAt' && value) {
                    value = dayjs(value).format('YYYY-MM-DD');
                }
                
                row[col.title] = value;
            });
            return row;
        });

        if (type === 'excel') {
            // Export to Excel
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
            
            // Generate filename
            const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}-${dayjs().format('YYYY-MM-DD')}.xlsx`;
            
            // Trigger download
            XLSX.writeFile(workbook, fileName);
            message.success(`Exported ${dataToExport.length} records to Excel`);
        } else if (type === 'csv') {
            // Export to CSV
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            
            // Create download link
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}-${dayjs().format('YYYY-MM-DD')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            message.success(`Exported ${dataToExport.length} records to CSV`);
        }
    };

    // Generate form items based on column definitions
    const getFormItems = () => {
        const formSettings = customColumns.form?.settings || {};
        const formFields = customColumns.form?.fields || [];
        const gridColumns = formSettings.gridColumns || 1;
        
        // If using single column layout, return the form items directly
        if (gridColumns === 1) {
            return formFields.map((field, index) => {
                return renderFormItem(field, index);
            });
        }
        
        // For grid layout, wrap items in Row and Col components
        return (
            <Row gutter={[16, 0]}>
                {formFields.map((field, index) => (
                    <Col 
                        key={index} 
                        xs={24} 
                        sm={gridColumns > 1 ? 12 : 24} 
                        md={24 / gridColumns}
                        lg={24 / gridColumns}
                    >
                        {renderFormItem(field, index)}
                    </Col>
                ))}
            </Row>
        );
    };
    
    // Helper function to render a single form item
    const renderFormItem = (field, index) => {
        const isDisabled = typeof field.disabled === 'function'
            ? field.disabled(modalMode)
            : field.disabled;

        let formItem;

        switch (field.type) {
            case 'input':
            case 'text':
                formItem = <Input disabled={isDisabled} />;
                break;
            case 'email':
                formItem = <Input type="email" disabled={isDisabled} />;
                break;
            case 'textArea':
                formItem = <TextArea rows={4} disabled={isDisabled} />;
                break;
            case 'number':
                formItem = <Input type="number" disabled={isDisabled} />;
                break;
            case 'select':
                formItem = (
                    <Select
                        disabled={isDisabled}
                        options={field.options || []}
                        allowClear
                    />
                );
                break;
            case 'date':
                formItem = <DatePicker style={{ width: '100%' }} disabled={isDisabled} />;
                break;
            case 'dateRange':
                formItem = <RangePicker style={{ width: '100%' }} disabled={isDisabled} />;
                break;
            case 'checkbox':
                formItem = <Checkbox disabled={isDisabled}>{field.label}</Checkbox>;
                break;
            case 'tags':
                formItem = (
                    <Select
                        mode="multiple"
                        disabled={isDisabled}
                        options={field.options || []}
                        tagRender={(props) => {
                            const { label, value, closable, onClose } = props;
                            return (
                                <Tag
                                    color="blue"
                                    closable={closable}
                                    onClose={onClose}
                                    style={{ marginRight: 3 }}
                                >
                                    {label}
                                </Tag>
                            );
                        }}
                    />
                );
                break;
            case 'radio':
                formItem = (
                    <Radio.Group disabled={isDisabled}>
                        {(field.options || []).map(option => (
                            <Radio key={option.value} value={option.value}>
                                {option.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
                break;
            default:
                formItem = <Input disabled={isDisabled} />;
        }

        const columnDef = customColumns.columns.find(col => col.dataIndex === field.dataIndex);
        const label = columnDef?.title || field.label || field.dataIndex;

        return (
            <Form.Item
                key={index}
                name={field.dataIndex}
                label={label}
                rules={field.rules || []}
            >
                {formItem}
            </Form.Item>
        );
    };

    // Build columns with action column
    const buildColumns = () => {
        const columns = [...customColumns.columns];

        // Add action column
        columns.push({
            title: 'Actions',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showEditForm(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure you want to delete this record?"
                            onConfirm={() => handleDeleteSingle(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        });

        return columns;
    };

    // Render filter components
    const renderFilters = () => {
        return (
            <Row gutter={[16, 16]} className="mb-4">
                {filters.map((filter, index) => {
                    const fields = Array.isArray(filter.field) ? filter.field : [filter.field];
                    const fieldKey = fields[0]; // Use the first field as the key for the filter value

                    switch (filter.type) {
                        case 'select':
                            return (
                                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                    <Form.Item className="mb-0">
                                        <Select
                                            placeholder={`Select ${filter.title}`}
                                            allowClear
                                            style={{ width: '100%' }}
                                            options={filter.options}
                                            value={filterValues[fieldKey]}
                                            onChange={(value) => {
                                                setFilterValues({
                                                    ...filterValues,
                                                    [fieldKey]: value
                                                });
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            );
                        case 'dateRange':
                            return (
                                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                    <Form.Item className="mb-0">
                                        <RangePicker
                                            style={{ width: '100%' }}
                                            value={filterValues[fieldKey]}
                                            onChange={(dates) => {
                                                setFilterValues({
                                                    ...filterValues,
                                                    [fieldKey]: dates
                                                });
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            );
                        case 'text':
                            return (
                                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                    <Form.Item className="mb-0">
                                        <Input
                                            placeholder={`Search ${filter.title}`}
                                            prefix={<SearchOutlined />}
                                            allowClear
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>
                            );
                        default:
                            return null;
                    }
                })}
                <Col xs={24} sm={12} md={8} lg={6} className="flex items-end">
                    <Button onClick={resetFilters} className="mb-[24px]">Reset Filters</Button>
                </Col>
            </Row>
        );
    };

    // Export menu items
    const exportMenu = {
        items: [
            {
                key: '1',
                label: 'Export to Excel',
                icon: <FileExcelOutlined />,
                onClick: () => handleExport('excel')
            },
            {
                key: '2',
                label: 'Export to CSV',
                icon: <FileTextOutlined />,
                onClick: () => handleExport('csv')
            }
        ]
    };

    return (
        <div className="crud-table">
            <Card>
                <div className="flex justify-between items-center mb-4 flex-wrap">
                    <Space className="mb-4 mt-2">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showAddForm}
                        >
                            Create
                        </Button>
                        <Popconfirm
                            title="Are you sure you want to delete these records?"
                            onConfirm={handleDeleteSelected}
                            okText="Yes"
                            cancelText="No"
                            disabled={selectedRowKeys.length === 0}
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                disabled={selectedRowKeys.length === 0}
                            >
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>
                {/* Filters */}
                {filters.length > 0 && (
                    renderFilters()
                )}

                {/* Table */}
                <Table
                    rowSelection={rowSelection}
                    columns={buildColumns()}
                    dataSource={filteredData}
                    loading={loading}
                    pagination={pagination}
                    scroll={{ x: 'max-content' }}
                    size="middle"
                    rowKey={record => {
                        // Use the first available field in rowkeys that has a value
                        for (const key of rowkeys) {
                            if (record[key] !== undefined && record[key] !== null) {
                                return record[key];
                            }
                        }
                        // Fallback to the record's key if available
                        return record.key;
                    }}
                />

                {/* Export Button */}
                <div className="mt-4">
                    <Dropdown menu={exportMenu} trigger={['click']}>
                        <Button icon={<DownloadOutlined />}>
                            Export
                        </Button>
                    </Dropdown>
                    <Text type="secondary" className="ml-2">
                        {selectedRowKeys.length > 0
                            ? `${selectedRowKeys.length} record(s) selected`
                            : 'Export all records'}
                    </Text>
                </div>
            </Card>

            {/* Form Modal */}
            <Modal
                title={modalMode === 'add' ? 'Add New Record' : 'Edit Record'}
                open={isModalVisible}
                onOk={handleFormSubmit}
                onCancel={() => setIsModalVisible(false)}
                width={'80%'}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout={customColumns.form?.settings?.layout || 'horizontal'}
                    labelCol={customColumns.form?.settings?.labelCol || { span: 6 }}
                    wrapperCol={customColumns.form?.settings?.wrapperCol || { span: 18 }}
                    style={customColumns.form?.settings?.style}
                >
                    {getFormItems()}
                </Form>
            </Modal>
        </div>
    );
};

export default CrudTable;
