'use client';
import React, { useState } from 'react';
import {
    Card, Button, Form, Input, Select, Switch, Typography, Space, Divider,
    Tag, Table, Modal, Tabs, Tooltip, message, Drawer, Row, Col
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, CopyOutlined, CodeOutlined,
    DownloadOutlined, FileTextOutlined, SaveOutlined, EditOutlined
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { items } = Tabs;

const FormBuilder = () => {
    const [formFields, setFormFields] = useState([
        {
            id: uuidv4(),
            dataIndex: 'username',
            title: 'Username',
            type: 'input',
            rules: [
                { required: true, message: 'Please input username!' },
                { min: 3, message: 'Username must be at least 3 characters!' }
            ],
            options: [],
            filterable: true,
            sortable: true
        },
        {
            id: uuidv4(),
            dataIndex: 'email',
            title: 'Email',
            type: 'email',
            rules: [
                { required: true, message: 'Please input email!' },
                { type: 'email', message: 'Please enter a valid email!' }
            ],
            options: [],
            filterable: true,
            sortable: true
        },
        {
            id: uuidv4(),
            dataIndex: 'role',
            title: 'Role',
            type: 'tags',
            rules: [
                { required: true, message: 'Please select role!' }
            ],
            options: [
                { label: 'Admin', value: 'Admin' },
                { label: 'Manager', value: 'Manager' },
                { label: 'User', value: 'User' }
            ],
            filterable: true,
            sortable: false
        }
    ]);
    
    const [formSettings, setFormSettings] = useState({
        title: 'User Management',
        layout: 'horizontal',
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        modalTitle: 'User Form',
        pageTitle: 'User Management'
    });
    
    const [codeModalVisible, setCodeModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [fieldFormVisible, setFieldFormVisible] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [form] = Form.useForm();
    
    const fieldTypes = [
        { label: 'Text Input', value: 'input' },
        { label: 'Email', value: 'email' },
        { label: 'Text Area', value: 'textArea' },
        { label: 'Number', value: 'number' },
        { label: 'Select', value: 'select' },
        { label: 'Date Picker', value: 'date' },
        { label: 'Date Range', value: 'dateRange' },
        { label: 'Checkbox', value: 'checkbox' },
        { label: 'Radio', value: 'radio' },
        { label: 'Tags', value: 'tags' }
    ];
    
    // Add a new field
    const handleAddField = () => {
        setCurrentField({
            id: uuidv4(),
            dataIndex: '',
            title: '',
            type: 'input',
            rules: [{ required: true, message: 'This field is required!' }],
            options: [],
            filterable: true,
            sortable: true
        });
        form.resetFields();
        setFieldFormVisible(true);
    };
    
    // Edit an existing field
    const handleEditField = (field) => {
        setCurrentField(field);
        form.setFieldsValue({
            dataIndex: field.dataIndex,
            title: field.title,
            type: field.type,
            required: field.rules?.some(rule => rule.required) || false,
            filterable: field.filterable,
            sortable: field.sortable,
            options: field.options || []
        });
        setFieldFormVisible(true);
    };
    
    // Save field from form
    const handleSaveField = async () => {
        try {
            const values = await form.validateFields();
            
            const fieldToSave = {
                id: currentField.id,
                dataIndex: values.dataIndex,
                title: values.title,
                type: values.type,
                rules: [
                    ...(values.required ? [{ required: true, message: `Please input ${values.title}!` }] : []),
                ],
                options: values.options || [],
                filterable: values.filterable,
                sortable: values.sortable
            };
            
            if (formFields.some(f => f.id === currentField.id)) {
                setFormFields(formFields.map(f => f.id === currentField.id ? fieldToSave : f));
            } else {
                setFormFields([...formFields, fieldToSave]);
            }
            
            setFieldFormVisible(false);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };
    
    // Delete a field
    const handleDeleteField = (fieldId) => {
        setFormFields(formFields.filter(field => field.id !== fieldId));
    };
    
    // Generate code for the page.js file
    const generatePageCode = () => {
        return `'use client';
import React, { useEffect, useState } from 'react';
import { Card, message, Typography } from 'antd';
import CrudTable from '@/components/CrudTable';
import { useTitleContext } from "@/components/TitleContext";
import { DatabaseOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import api from "@/lib/api";

const { Text } = Typography;

export default function ${formSettings.title.replace(/\s+/g, '')}() {
    useTitleContext({ title: '${formSettings.pageTitle}', icon: <DatabaseOutlined /> });
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const options = {
        columns: [
            ${formFields.map(field => `{
                title: '${field.title}',
                dataIndex: '${field.dataIndex}',
                key: '${field.dataIndex}',
                ${field.filterable ? 'filterable: true,' : ''}
                ${field.sortable ? 'sorter: true,' : ''}
                ${field.type === 'date' ? 'render: (text) => dayjs(text).format(\'YYYY-MM-DD\'),' : ''}
            }`).join(',\n            ')}
        ],
        form: {
            settings: {
                title: '${formSettings.modalTitle}',
                labelCol: { span: ${formSettings.labelCol.span} },
                wrapperCol: { span: ${formSettings.wrapperCol.span} },
                layout: '${formSettings.layout}'
            },
            fields: [
                ${formFields.map(field => `{
                    dataIndex: '${field.dataIndex}',
                    type: '${field.type}',
                    ${field.options && field.options.length > 0 ?
                        `options: [
                            ${field.options.map(opt => `{ label: '${opt.label}', value: '${opt.value}' }`).join(',\n                            ')}
                        ],` : ''}
                    rules: [
                        ${field.rules.map(rule => {
                            if (rule.required) return `{ required: true, message: 'Please input ${field.title}!' }`;
                            if (rule.type) return `{ type: '${rule.type}', message: 'Please enter a valid ${field.title}!' }`;
                            return JSON.stringify(rule);
                        }).join(',\n                        ')}
                    ]
                }`).join(',\n                ')}
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
            const res = await api.put(\`userData/\${key}\`, updatedRecord);
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
            await Promise.all(keys.map(key => api.delete(\`userData/\${key}\`)));
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
                title="${formSettings.title}"
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
}`;
    };
    
    // Generate code
    const generateCode = () => {
        return {
            page: generatePageCode()
        };
    };
    
    // Show code modal
    const showCodeModal = () => {
        setCodeModalVisible(true);
    };
    
    // Handle copy code
    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                message.success('Code copied to clipboard');
            })
            .catch(() => {
                message.error('Failed to copy code');
            });
    };
    
    // Handle download code
    const handleDownloadCode = (code, filename) => {
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        a.click();
        URL.revokeObjectURL(url);
    };
    
    // Field form for add/edit
    const renderFieldForm = () => (
        <Drawer
            title={currentField?.id ? 'Edit Field' : 'Add Field'}
            open={fieldFormVisible}
            onClose={() => setFieldFormVisible(false)}
            width={500}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={() => setFieldFormVisible(false)} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveField} type="primary">
                        Save
                    </Button>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    required: true,
                    filterable: true,
                    sortable: true,
                    options: []
                }}
            >
                <Form.Item
                    name="dataIndex"
                    label="Field Name (dataIndex)"
                    rules={[{ required: true, message: 'Please input field name!' }]}
                >
                    <Input placeholder="e.g. username, email, status" />
                </Form.Item>
                
                <Form.Item
                    name="title"
                    label="Display Title"
                    rules={[{ required: true, message: 'Please input display title!' }]}
                >
                    <Input placeholder="e.g. Username, Email, Status" />
                </Form.Item>
                
                <Form.Item
                    name="type"
                    label="Field Type"
                    rules={[{ required: true, message: 'Please select field type!' }]}
                >
                    <Select options={fieldTypes} />
                </Form.Item>
                
                <Form.Item
                    name="required"
                    valuePropName="checked"
                    label="Required"
                >
                    <Switch />
                </Form.Item>
                
                <Form.Item
                    name="filterable"
                    valuePropName="checked"
                    label="Filterable"
                >
                    <Switch />
                </Form.Item>
                
                <Form.Item
                    name="sortable"
                    valuePropName="checked"
                    label="Sortable"
                >
                    <Switch />
                </Form.Item>
                
                <Form.List name="options">
                    {(fields, { add, remove }) => {
                        const selectedType = form.getFieldValue('type');
                        const showOptions = ['select', 'radio', 'tags'].includes(selectedType);
                        
                        if (!showOptions) {
                            return null;
                        }
                        
                        return (
                            <>
                                <Divider orientation="left">Options</Divider>
                                {fields.map(field => (
                                    <Row key={field.key} gutter={8}>
                                        <Col span={10}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'label']}
                                                rules={[{ required: true, message: 'Missing label' }]}
                                            >
                                                <Input placeholder="Label" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'value']}
                                                rules={[{ required: true, message: 'Missing value' }]}
                                            >
                                                <Input placeholder="Value" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Button
                                                icon={<DeleteOutlined />}
                                                onClick={() => remove(field.name)}
                                                danger
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add({ label: '', value: '' })}
                                        icon={<PlusOutlined />}
                                        block
                                    >
                                        Add Option
                                    </Button>
                                </Form.Item>
                            </>
                        );
                    }}
                </Form.List>
            </Form>
        </Drawer>
    );
    
    // Field list table
    const renderFieldsTable = () => {
        const columns = [
            {
                title: 'Field Name',
                dataIndex: 'dataIndex',
                key: 'dataIndex'
            },
            {
                title: 'Display Title',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                render: (type) => {
                    const typeInfo = fieldTypes.find(t => t.value === type);
                    return typeInfo ? typeInfo.label : type;
                }
            },
            {
                title: 'Required',
                dataIndex: 'rules',
                key: 'required',
                render: (rules) => rules?.some(rule => rule.required) ? 'Yes' : 'No'
            },
            {
                title: 'Options',
                dataIndex: 'options',
                key: 'options',
                render: (options) => options?.length > 0 ? (
                    <Tooltip title={options.map(o => `${o.label} (${o.value})`).join(', ')}>
                        <Tag color="blue">{options.length} options</Tag>
                    </Tooltip>
                ) : null
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                    <Space>
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditField(record)}
                        />
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteField(record.id)}
                        />
                    </Space>
                )
            }
        ];
        
        return (
            <Table
                columns={columns}
                dataSource={formFields}
                rowKey="id"
                pagination={false}
                size="small"
            />
        );
    };
    
    // Form settings form
    const renderSettingsForm = () => {
        const handleSettingsChange = (key, value) => {
            setFormSettings({
                ...formSettings,
                [key]: value
            });
        };
        
        return (
            <Form layout="vertical">
                <Form.Item label="Page Title">
                    <Input
                        value={formSettings.pageTitle}
                        onChange={(e) => handleSettingsChange('pageTitle', e.target.value)}
                    />
                </Form.Item>
                
                <Form.Item label="Form Title">
                    <Input
                        value={formSettings.title}
                        onChange={(e) => handleSettingsChange('title', e.target.value)}
                    />
                </Form.Item>
                
                <Form.Item label="Modal Title">
                    <Input
                        value={formSettings.modalTitle}
                        onChange={(e) => handleSettingsChange('modalTitle', e.target.value)}
                    />
                </Form.Item>
                
                <Form.Item label="Form Layout">
                    <Select
                        value={formSettings.layout}
                        onChange={(value) => handleSettingsChange('layout', value)}
                        options={[
                            { label: 'Horizontal', value: 'horizontal' },
                            { label: 'Vertical', value: 'vertical' },
                            { label: 'Inline', value: 'inline' }
                        ]}
                    />
                </Form.Item>
                
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Label Column Width">
                            <Input
                                type="number"
                                min={1}
                                max={24}
                                value={formSettings.labelCol.span}
                                onChange={(e) => handleSettingsChange('labelCol', { span: parseInt(e.target.value) })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Wrapper Column Width">
                            <Input
                                type="number"
                                min={1}
                                max={24}
                                value={formSettings.wrapperCol.span}
                                onChange={(e) => handleSettingsChange('wrapperCol', { span: parseInt(e.target.value) })}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    };
    
    // Code modal content
    const renderCodeModal = () => {
        const code = generateCode();
        
        return (
            <Modal
                title="Generated Code"
                open={codeModalVisible}
                onCancel={() => setCodeModalVisible(false)}
                width={800}
                footer={null}
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <items tab="Page Code" key="1">
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                                <Space>
                                    <Button
                                        icon={<CopyOutlined />}
                                        onClick={() => handleCopyCode(code.page)}
                                    >
                                        Copy
                                    </Button>
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={() => handleDownloadCode(code.page, 'page.js')}
                                    >
                                        Download
                                    </Button>
                                </Space>
                            </div>
                            <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px', marginTop: '40px' }}>
                                <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflow: 'auto' }}>
                                    {code.page}
                                </pre>
                            </div>
                        </div>
                    </items>
                </Tabs>
            </Modal>
        );
    };
    
    return (
        <Card>
            <Title level={2}>Form Builder</Title>
            <Text>Design your user management form structure and generate code</Text>
            
            <Tabs defaultActiveKey="1">
                <items tab="Fields" key="1">
                    <div style={{ marginBottom: '16px' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddField}>
                            Add Field
                        </Button>
                    </div>
                    {renderFieldsTable()}
                </items>
                
                <items tab="Settings" key="2">
                    {renderSettingsForm()}
                </items>
            </Tabs>
            
            <Divider />
            
            <div style={{ textAlign: 'right' }}>
                <Button
                    type="primary"
                    icon={<CodeOutlined />}
                    onClick={showCodeModal}
                    disabled={formFields.length === 0}
                >
                    Generate Code
                </Button>
            </div>
            
            {renderFieldForm()}
            {renderCodeModal()}
        </Card>
    );
};

export default FormBuilder;
