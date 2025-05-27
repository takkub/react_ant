'use client';
import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import {
    Table, Button, Space, Modal, Form, Input,
    Select, DatePicker, Checkbox, message, Card,
    Row, Col, Tooltip, Dropdown, Typography, // Removed Tag
    Popconfirm, Radio
} from 'antd';
import {
    PlusOutlined, DeleteOutlined,
    SearchOutlined, EditOutlined,
    DownloadOutlined, FileExcelOutlined, FileTextOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const { Text } = Typography; // Removed Title
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CrudTable = ({
    title,
    data,
    onAdd,
    onEdit,
    onDelete,
    onExport,
    loading = false,
    customColumns = { columns: [] },
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

    const tableFilterFields = useMemo(() => customColumns.filters?.fields || [], [customColumns.filters?.fields]); // Wrapped in useMemo

    const [tablePagination, setTablePagination] = useState(() => {
        const paginationConfig = customColumns?.pagination;
        if (paginationConfig.pageSizeOptions) {
            paginationConfig.pageSizeOptions = paginationConfig.pageSizeOptions.map(size =>
                typeof size === 'string' ? parseInt(size, 10) : size
            );
        }

        return {
            ...paginationConfig,
            current: 1,
            onChange: (page, pageSize) => {
                setTablePagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize
                }));
            },
            onShowSizeChange: (current, size) => {
                setTablePagination(prev => ({
                    ...prev,
                    current: 1,
                    pageSize: size
                }));
            }
        };
    });

    useEffect(() => {
        const applyFilters = () => {
            let result = [...data];

            Object.entries(filterValues).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    const filter = tableFilterFields.find(f => f.field === key || (Array.isArray(f.field) && f.field.includes(key)));

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
                        }
                    }
                }
            });

            if (searchText) {
                const searchFilters = tableFilterFields.filter(f => f.type === 'text');
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
    }, [data, filterValues, searchText, tableFilterFields]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();

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

    const showAddForm = () => {
        setModalMode('add');
        setEditingKey(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditForm = (record) => {
        setModalMode('edit');

        let editKey = record.key;
        for (const key of rowkeys) {
            if (record[key] !== undefined && record[key] !== null) {
                editKey = record[key];
                break;
            }
        }

        setEditingKey(editKey);

        const formValues = { ...record };

        if (form) {
            form.setFieldsValue(formValues);
        } else {
            console.error("Form instance is not properly initialized");
        }
        setIsModalVisible(true);
    };

    const handleDelete = async (keys) => {
        if (Array.isArray(keys) && keys.length > 0) {
            await onDelete(keys);
            setSelectedRowKeys([]);
        }
    };

    const handleDeleteSingle = async (record) => {
        const keys = rowkeys.map(key => record[key]).filter(val => val !== undefined);
        const keyToDelete = keys.length > 0 ? keys[0] : record.key;

        await handleDelete([keyToDelete]);
    };

    const handleDeleteSelected = async () => {
        if (selectedRowKeys.length > 0) {
            await handleDelete(selectedRowKeys);
        } else {
            message.warning('Please select at least one record to delete');
        }
    };

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

        const columns = customColumns.columns;

        const exportData = dataToExport.map(record => {
            const row = {};
            columns.forEach(col => {
                let value = record[col.dataIndex];

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
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

            const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}-${dayjs().format('YYYY-MM-DD')}.xlsx`;

            XLSX.writeFile(workbook, fileName);
            message.success(`Exported ${dataToExport.length} records to Excel`);
        } else if (type === 'csv') {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const csv = XLSX.utils.sheet_to_csv(worksheet);

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

    // Generate form items based on column definitions and cardGroupSetting
    const getFormItems = () => {
        const formSettings = customColumns.form?.settings || {};
        const formFields = customColumns.form?.fields || [];
        const cardGroupSettings = customColumns.form?.cardGroupSetting;

        if (cardGroupSettings && Array.isArray(cardGroupSettings) && cardGroupSettings.length > 0) {
            const renderedGroups = cardGroupSettings.map(group => {
                const groupFields = formFields.filter(field => field.cardGroup === group.key);
                if (groupFields.length === 0) {
                    return null;
                }

                const groupGridColumns = group.gridColumns || formSettings.gridColumns || 1;
                // Use group-specific layout settings, fallback to global formSettings
                const groupLayoutSettings = {
                    layout: group.layout || formSettings.layout,
                    labelCol: group.labelCol || formSettings.labelCol,
                    wrapperCol: group.wrapperCol || formSettings.wrapperCol,
                };

                return (
                    <Card key={group.key} title={group.title || 'Group'} style={{ marginBottom: 16 }}>
                        <Row gutter={[16, 0]}>
                            {groupFields.map((field) => (
                                <Col
                                    key={field.dataIndex}
                                    xs={24}
                                    sm={groupGridColumns > 1 ? (24 / Math.min(groupGridColumns, 2)) : 24}
                                    md={24 / groupGridColumns}
                                    lg={24 / groupGridColumns}
                                >
                                    {renderFormItem(field, field.dataIndex, groupLayoutSettings)}
                                </Col>
                            ))}
                        </Row>
                    </Card>
                );
            }).filter(Boolean);

            // Render fields not in any group, if any
            const ungroupedFields = formFields.filter(field => !field.cardGroup || !cardGroupSettings.find(g => g.key === field.cardGroup));
            if (ungroupedFields.length > 0) {
                const globalGridColumns = formSettings.gridColumns || 1;
                renderedGroups.push(
                    <Card key="ungrouped-fields" title="Other Fields" style={{ marginBottom: 16 }}>
                        <Row gutter={[16, 0]}>
                            {ungroupedFields.map((field) => (
                                <Col
                                    key={field.dataIndex}
                                    xs={24}
                                    sm={globalGridColumns > 1 ? 12 : 24}
                                    md={24 / globalGridColumns}
                                    lg={24 / globalGridColumns}
                                >
                                    {renderFormItem(field, field.dataIndex, formSettings)}
                                </Col>
                            ))}
                        </Row>
                    </Card>
                );
            }
            return renderedGroups;

        } else {
            // Existing logic for non-grouped or single-group layout
            const gridColumns = formSettings.gridColumns || 1;
            if (gridColumns === 1 && (!formSettings.layout || formSettings.layout === 'vertical')) { // Simpler rendering for single column vertical
                return formFields.map((field) => renderFormItem(field, field.dataIndex, formSettings));
            }
            return (
                <Row gutter={[16, 0]}>
                    {formFields.map((field) => (
                        <Col
                            key={field.dataIndex}
                            xs={24}
                            sm={gridColumns > 1 ? 12 : 24}
                            md={24 / gridColumns}
                            lg={24 / gridColumns}
                        >
                            {renderFormItem(field, field.dataIndex, formSettings)}
                        </Col>
                    ))}
                </Row>
            );
        }
    };

    // Helper function to render a single form item
    const renderFormItem = (field, key, itemLayoutSettings) => {
        const isDisabled = typeof field.disabled === 'function'
            ? field.disabled(modalMode)
            : field.disabled;

        let formItemComponent;
        let formItemProps = {};

        switch (field.type) {
            case 'input':
            case 'text':
                formItemComponent = <Input disabled={isDisabled} />;
                break;
            case 'email':
                formItemComponent = <Input type="email" disabled={isDisabled} />;
                break;
            case 'textArea':
                formItemComponent = <TextArea rows={field.rows || 4} disabled={isDisabled} />;
                break;
            case 'number':
                formItemComponent = <Input
                    type="number"
                    disabled={isDisabled}
                    style={{ width: '100%' }}
                    onChange={(e) => {
                        // Convert string value to number before setting in form
                        let numValue = undefined;

                        // Check if input is a valid number
                        if (e.target.value !== '') {
                            numValue = Number(e.target.value);

                            // Validate if conversion was successful and it's a valid number
                            if (isNaN(numValue)) {
                                // If not a valid number, don't update the form value
                                return;
                            }
                        }

                        form.setFieldValue(field.dataIndex, numValue);
                    }}
                />;

                // Add getValueFromEvent handler to ensure number type for validation
                formItemProps.getValueFromEvent = (e) => {
                    if (e?.target?.value === '') return undefined;
                    const val = Number(e?.target?.value);
                    return isNaN(val) ? undefined : val;
                };

                // Add normalize function to convert string to number during form validation
                formItemProps.normalize = (value) => {
                    if (value === undefined || value === null || value === '') return undefined;
                    const val = Number(value);
                    return isNaN(val) ? undefined : val;
                };

                break;
            case 'select':
                formItemComponent = (
                    <Select
                        disabled={isDisabled}
                        options={field.options || []}
                        allowClear
                        showSearch={field.showSearch || false}
                        optionFilterProp={field.optionFilterProp || "children"}
                        filterOption={field.filterOption || ((input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()))}
                    />
                );
                break;
            case 'date':
                formItemComponent = <DatePicker style={{ width: '100%' }} disabled={isDisabled} format={field.format || "YYYY-MM-DD"} />;
                break;
            case 'dateRange':
                formItemComponent = <RangePicker style={{ width: '100%' }} disabled={isDisabled} format={field.format || "YYYY-MM-DD"} />;
                break;
            case 'checkbox': // This is for a single checkbox. Checkbox.Group would be different.
                formItemComponent = <Checkbox disabled={isDisabled}>{field.checkboxLabel || ''}</Checkbox>;
                break;
            case 'tags':
                formItemComponent = (
                    <Select
                        mode="tags" // Changed from "multiple" to "tags" for free-form input
                        disabled={isDisabled}
                        options={field.options || []} // Options can still be provided as suggestions
                        tokenSeparators={[',']}
                    // tagRender prop can be used for custom tag appearance if needed
                    />
                );
                break;
            case 'radio':
                formItemComponent = (
                    <Radio.Group disabled={isDisabled} options={field.options || []}>
                        {/* Options are now directly passed to Radio.Group if they are in {label, value} format */}
                    </Radio.Group>
                );
                break;
            default:
                formItemComponent = <Input disabled={isDisabled} />;
        }

        const columnDef = customColumns.columns.find(col => col.dataIndex === field.dataIndex);
        const label = field.label || columnDef?.title || field.dataIndex;

        // Determine layout for this specific item
        const itemSpecificLayout = itemLayoutSettings?.layout || customColumns.form?.settings?.layout || 'horizontal';
        const itemLabelCol = itemLayoutSettings?.labelCol || customColumns.form?.settings?.labelCol;
        const itemWrapperCol = itemLayoutSettings?.wrapperCol || customColumns.form?.settings?.wrapperCol;

        return (
            <Form.Item
                key={key}
                name={field.dataIndex}
                label={label}
                rules={field.rules || []}
                {...(itemSpecificLayout === 'horizontal' && { // Apply labelCol/wrapperCol only if layout is horizontal
                    labelCol: itemLabelCol,
                    wrapperCol: itemWrapperCol,
                })}
                {...(field.type === 'checkbox' && { valuePropName: 'checked' })} // For single Checkbox
                {...formItemProps} // Apply additional form item props specific to field type
            >
                {formItemComponent}
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

    const finalColumns = useMemo(() => buildColumns(), [customColumns.columns, rowkeys]); // Memoize finalColumns

    // Render filter components
    const renderFilters = () => {
        return (
            <Row gutter={8} className="mb-4" justify="end">
                {tableFilterFields.map((filter, index) => {
                    const fields = Array.isArray(filter.field) ? filter.field : [filter.field];
                    const fieldKey = fields[0];

                    switch (filter.type) {
                        case 'select':
                            return (
                                <Col key={index} xs={24} sm={12} md={6} lg={4}>
                                    <Form.Item className="mb-0" style={{ marginBottom: 8 }}>
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
                                    <Form.Item className="mb-0" style={{ marginBottom: 8 }}>
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
                                <Col key={index} xs={24} sm={12} md={6} lg={4}>
                                    <Form.Item className="mb-0" style={{ marginBottom: 8 }}>
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
            </Row>
        );
    };

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
                <Row className="mb-4" style={{ marginBottom: 20 }}>
                    <Col span={4}>
                        <Row gutter={8}>
                            <Col style={{ marginBottom: 8 }}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={showAddForm}
                                >
                                    Create
                                </Button>
                            </Col>
                            <Col style={{ marginBottom: 8 }}>
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
                            </Col>
                        </Row>
                    </Col>
                    <Col flex="auto">
                        {tableFilterFields.length > 0 && (
                            renderFilters()
                        )}
                    </Col>
                </Row>

                <Table
                    rowSelection={rowSelection}
                    columns={finalColumns} // Use finalColumns (which calls buildColumns)
                    dataSource={filteredData}
                    loading={loading}
                    pagination={tablePagination}
                    scroll={{ x: 'max-content' }}
                    size="middle"
                    rowKey={record => {
                        for (const key of rowkeys) {
                            if (record[key] !== undefined && record[key] !== null) {
                                return record[key];
                            }
                        }
                        return record.key;
                    }}
                />

                <div style={{ marginTop: 24 }}>
                    <Dropdown menu={exportMenu} trigger={['click']}>
                        <Button icon={<DownloadOutlined />} className='mr-8'>
                            Export
                        </Button>
                    </Dropdown>
                    <Text type="secondary" className="ml-2" style={{ marginLeft: 8 }}>
                        {selectedRowKeys.length > 0
                            ? `${selectedRowKeys.length} record(s) selected`
                            : 'Export all records'}
                    </Text>
                </div>
            </Card>

            <Modal
                title={modalMode === 'add' ? (customColumns.form?.settings?.addModalTitle || 'Add New Record') : (customColumns.form?.settings?.editModalTitle || 'Edit Record')}
                open={isModalVisible}
                onOk={handleFormSubmit}
                onCancel={() => setIsModalVisible(false)}
                width={customColumns.form?.settings?.modalWidth || '80%'}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout={customColumns.form?.settings?.layout || 'horizontal'}
                    labelCol={customColumns.form?.settings?.labelCol || { span: 6 }}
                    wrapperCol={customColumns.form?.settings?.wrapperCol || { span: 18 }}
                    style={customColumns.form?.settings?.style}
                    initialValues={customColumns.form?.settings?.initialValues || {}}
                >
                    {getFormItems()}
                </Form>
            </Modal>
        </div>
    );
};

export default CrudTable;
