'use client';
import React, { useState, useEffect } from 'react';
import {
    Card, Button, Form, Input, Select, Switch, Typography, Space, Divider,
    Tag, Table, Modal, Tabs, Tooltip, message, Drawer, Row, Col, Steps, Empty,
    Result, Radio, Segmented, Badge, Alert, List, Avatar, DatePicker, Checkbox,
    InputNumber, Cascader
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, CopyOutlined, CodeOutlined, DownloadOutlined, 
    FileTextOutlined, SaveOutlined, EditOutlined, SettingOutlined, UserOutlined, 
    FormOutlined, CheckCircleOutlined, EyeOutlined, AppstoreOutlined, BarsOutlined,
    CheckOutlined, LayoutOutlined, TableOutlined, ThunderboltOutlined, FileAddOutlined,
    SmileOutlined, CaretRightOutlined, RightOutlined, LeftOutlined, MailOutlined,
    NumberOutlined, CalendarOutlined, CheckSquareOutlined, TagsOutlined, DownOutlined,
    InfoCircleOutlined, PhoneOutlined, QuestionCircleOutlined, StarOutlined,
    DatabaseOutlined
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

// FormCodeGenerator component - now included in FormBuilder
const FormCodeGenerator = ({ formFields, formSettings, formTitle, tableName }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const sanitizedTableName = tableName || formTitle?.toLowerCase().replace(/\s+/g, '_') || 'custom_form';
  
  // Function to generate the SQL CREATE TABLE statement
  const generateSqlCode = () => {
    // Map form field types to SQL column types
    const getColumnType = (fieldType) => {
      switch (fieldType) {
        case 'input': return 'VARCHAR(255)';
        case 'textArea': return 'TEXT';
        case 'email': return 'VARCHAR(255)';
        case 'number': return 'INT';
        case 'date': return 'DATE';
        case 'datetime': return 'DATETIME';
        case 'dateRange': return 'VARCHAR(255)';
        case 'radio': return 'VARCHAR(50)';
        case 'select': return 'VARCHAR(100)';
        case 'checkbox': return 'VARCHAR(255)';
        case 'tags': return 'JSON';
        case 'boolean': return 'TINYINT(1)';
        default: return 'VARCHAR(255)';
      }
    };

    // Generate the CREATE TABLE statement with columns
    let sql = `-- SQL CREATE TABLE statement for ${formTitle}\n`;
    sql += `CREATE TABLE \`${sanitizedTableName}\` (\n`;
    sql += `  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n`;
    
    // Add columns for each form field
    formFields.forEach(field => {
      // Get SQL column type
      const columnType = getColumnType(field.type);
      
      // Check if the field is required
      const isRequired = field.rules?.some(rule => rule.required);
      const nullableStr = isRequired ? 'NOT NULL' : 'NULL';
      
      // Add the column definition
      sql += `  \`${field.dataIndex || field.name}\` ${columnType} ${nullableStr},\n`;
    });
    
    // Add created/updated timestamps
    sql += `  \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n`;
    sql += `);\n\n`;
    
    // Add sample INSERT statement
    sql += `-- Sample INSERT statement\n`;
    sql += `INSERT INTO \`${sanitizedTableName}\` (\n  `;
    sql += formFields.map(field => `\`${field.dataIndex || field.name}\``).join(',\n  ');
    sql += `\n) VALUES (\n  `;
    sql += formFields.map(() => '?').join(',\n  ');
    sql += `\n);\n`;
    
    return sql;
  };

  // Function to generate the route.js code
  const generateRouteCode = () => {
    return `import {getData, insertData, deleteData, updateData} from "@/lib/mysqldb";

const checkPayload = async (method, req) => {
    let body;
    if (method !== 'get') {
        body = await req.json();
    } else {
        const url = new URL(req.url);
        const params = url.searchParams
        body = Object.fromEntries(params.entries());
    }
    return body
}

/**
 * GET - Retrieve ${sanitizedTableName} data
 * Endpoint to fetch all ${sanitizedTableName} data
 */
export const GET = async (req) => {
    try {
        // Parse request parameters
        const params = await checkPayload('get', req);
        const {data} = await getData('${sanitizedTableName}', params);
        if (data) {
            return new Response(JSON.stringify({
                success: true,
                data: data,
                total: data.length,
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'No ${sanitizedTableName} data found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error fetching ${sanitizedTableName} data:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * POST - Create new ${sanitizedTableName} data
 * Endpoint to create a new ${sanitizedTableName} record
 */
export const POST = async (req) => {
    try {
        // Parse request body
        const params = await checkPayload('post', req);
        const data = await insertData('${sanitizedTableName}', params)
        console.log(data)
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: '${formTitle} created successfully',
                data: {...params, id: data.id}
            }), { status: 201 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: data.message || 'Failed to create ${formTitle}'
            }), { status: 400 });
        }
    } catch (error) {
        console.error('❌ Error creating ${formTitle}:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * PUT - Update existing ${sanitizedTableName} data
 * Endpoint to update a ${sanitizedTableName} record by ID
 */
export const PUT = async (req) => {
    try {
        // Parse request body
        const {body, where} = await checkPayload('put', req);
        const data = await updateData('${sanitizedTableName}', body, where);
        console.log(data)
        
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: '${formTitle} updated successfully',
                data: body
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: '${formTitle} not found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error updating ${formTitle}:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}

/**
 * DELETE - Remove ${sanitizedTableName} data
 * Endpoint to delete a ${sanitizedTableName} record by ID
 */
export const DELETE = async (req) => {
    try {
        const params = await checkPayload('delete', req);
        const data = await deleteData('${sanitizedTableName}', params)
        if (data.status) {
            return new Response(JSON.stringify({
                success: true,
                message: '${formTitle} deleted successfully',
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: '${formTitle} not found'
            }), { status: 404 });
        }
    } catch (error) {
        console.error('❌ Error deleting ${formTitle}:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), { status: 500 });
    }
}`;
  };

  // Function to generate the page code
  const generatePageCode = () => {
    // Format field for columns config
    const formatColumns = (fields) => {
      return fields.map(field => {
        let column = {
          title: field.title || field.label,
          dataIndex: field.dataIndex || field.name,
          key: field.dataIndex || field.name,
          filterable: true
        };
        
        // Add special handlers for specific field types
        if (field.type === 'date' || field.type === 'datetime') {
          column.render = `(text) => { return dayjs(text).format('YYYY-MM-DD'); }`;
          column.sorter = true;
        }
        
        if (field.type === 'select' || field.type === 'radio') {
          column.filters = field.options?.map(opt => ({ text: opt.label, value: opt.value }));
          column.onFilter = `(value, record) => record.${field.dataIndex || field.name} === value`;
        }
        
        return column;
      });
    };
    
    // Format field for form config
    const formatFormFields = (fields) => {
      return fields.map(field => {
        let formField = {
          dataIndex: field.dataIndex || field.name,
          type: field.type,
          rules: field.rules || [{ required: true, message: `Please input ${field.title || field.label}!` }]
        };
        
        if (field.options && field.options.length > 0) {
          formField.options = field.options;
        }
        
        return formField;
      });
    };
    
    // Generate component name based on table name
    const componentName = formTitle
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^./, str => str.toUpperCase());
    
    // Generate the page code
    return `'use client';
import React, {useEffect, useState} from 'react';
import {Card, message, Typography} from 'antd';
import CrudTable from '@/components/CrudTable';
import {useTitleContext} from "@/components/TitleContext";
import {DatabaseOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';
import api from "@/lib/api";
const {Text} = Typography;

export default function ${componentName}() {
    useTitleContext({title: '${formTitle}', icon: <DatabaseOutlined/>});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const options = {
        columns: ${JSON.stringify(formatColumns(formFields), null, 8)
          .replace(/"render": "(.*?)"/g, '"render": $1')
          .replace(/"onFilter": "(.*?)"/g, '"onFilter": $1')},
        form: {
            settings: {
                title: '${formTitle} Form',
                labelCol: {span: ${formSettings?.labelCol?.span || 6}},
                wrapperCol: {span: ${formSettings?.wrapperCol?.span || 18}},
                layout: '${formSettings?.layout || "horizontal"}',
                gridColumns: ${formSettings?.gridColumns || 1}
            },
            fields: ${JSON.stringify(formatFormFields(formFields), null, 8)}
        }
    }
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('${sanitizedTableName}');
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
            const res = await api.post('${sanitizedTableName}', newRecord);
            setData([...data, res.data]);
            message.success(\`New record added successfully\`);
        } catch (error) {
            // Handle error response
            console.error('Error adding record:', error);
            if (error.response && error.response.data) {
                console.error('Error details:', error.response.data);
                message.error(\`Failed to add record: \${error.response.data.message}\`);
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
                await api.put(\`${sanitizedTableName}\`, {body: updatedRecord, where: { id: key }});
                newData[index] = {...newData[index], ...updatedRecord};
                setData(newData);
                message.success(\`Record updated successfully\`);
            }
        } catch (error) {
            console.error('Error updating record:', error);
            message.error('Failed to update record. Please try again.');
        }
    };
    
    const handleDelete = (data, setData) => async (keys) => {
        try {
            await Promise.all(keys.map(key => api.delete(\`${sanitizedTableName}\`, {id: key})));
            const newData = data.filter(item => !keys.includes(item.id));
            setData(newData);
            message.success(\`\${keys.length} record(s) deleted successfully\`);
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
                        return \`"\${item[col.dataIndex].join(', ')}"\`;
                    } else if (col.dataIndex === 'createdAt' && item[col.dataIndex]) {
                        return dayjs(item[col.dataIndex]).format('YYYY-MM-DD');
                    }
                    return \`"\${item[col.dataIndex] || ''}"\`;
                }).join(',');
            });
            
            const csvString = [headers, ...csvRows].join('\\n');
            
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', \`${sanitizedTableName}-export-\${dayjs().format('YYYY-MM-DD')}.csv\`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            message.success(\`Exported \${dataToExport.length} records successfully\`);
        } catch (error) {
            console.error('Error exporting data:', error);
            message.error('Failed to export data. Please try again.');
        }
    };
    
    return (
        <Card className="p-4">
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <CrudTable
                title="${formTitle}"
                data={data}
                setData={setData}
                onAdd={handleAdd(data, setData)}
                onEdit={handleEdit(data, setData)}
                onDelete={handleDelete(data, setData)}
                onExport={handleExport(data)}
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
}`;
  };

  // Copy code to clipboard
  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => message.success('Code copied to clipboard!'))
      .catch(() => message.error('Failed to copy code.'));
  };

  // Download code
  const downloadCode = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Button 
        type="primary" 
        icon={<CodeOutlined />}
        onClick={() => setIsModalVisible(true)}
      >
        Generate Code
      </Button>

      <Modal
        title="Generated Code"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: '1',
              label: 'Page Code',
              children: (
                <Card>
                  <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatePageCode())}
                    >
                      Copy
                    </Button>
                    <Button 
                      icon={<DownloadOutlined />} 
                      onClick={() => downloadCode(generatePageCode(), `${sanitizedTableName}.page.js`)}
                    >
                      Download
                    </Button>
                  </Space>
                  <SyntaxHighlighter language="javascript" style={tomorrow} showLineNumbers>
                    {generatePageCode()}
                  </SyntaxHighlighter>
                </Card>
              )
            },
            {
              key: '2',
              label: 'Route Code',
              children: (
                <Card>
                  <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generateRouteCode())}
                    >
                      Copy
                    </Button>
                    <Button 
                      icon={<DownloadOutlined />} 
                      onClick={() => downloadCode(generateRouteCode(), `${sanitizedTableName}.route.js`)}
                    >
                      Download
                    </Button>
                  </Space>
                  <SyntaxHighlighter language="javascript" style={tomorrow} showLineNumbers>
                    {generateRouteCode()}
                  </SyntaxHighlighter>
                </Card>
              )
            },
            {
              key: '3',
              label: 'Create Table Code',
              children: (
                <Card>
                  <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generateSqlCode())}
                    >
                      Copy
                    </Button>
                    <Button 
                      icon={<DownloadOutlined />} 
                      onClick={() => downloadCode(generateSqlCode(), `${sanitizedTableName}.sql`)}
                    >
                      Download
                    </Button>
                  </Space>
                  <SyntaxHighlighter language="sql" style={tomorrow} showLineNumbers>
                    {generateSqlCode()}
                  </SyntaxHighlighter>
                </Card>
              )
            }
          ]}
        />
      </Modal>
    </>
  );
};

// FormBuilder - An easy-to-use form generation tool
const FormBuilder = () => {
    // Available form templates
    const formTemplates = [
        {
            id: 'user',
            name: 'User Management',
            icon: <UserOutlined />,
            description: 'Create, edit and manage user accounts with roles',
            fields: [
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
            ],
            settings: {
                title: 'User Management',
                layout: 'horizontal',
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
                modalTitle: 'User Form',
                pageTitle: 'User Management',
                gridColumns: 1
            }
        },
        {
            id: 'product',
            name: 'Product Catalog',
            icon: <AppstoreOutlined />,
            description: 'Manage products with price, inventory and categories',
            fields: [
                {
                    id: uuidv4(),
                    dataIndex: 'productName',
                    title: 'Product Name',
                    type: 'input',
                    rules: [{ required: true, message: 'Please input product name!' }],
                    options: [],
                    filterable: true,
                    sortable: true
                },
                {
                    id: uuidv4(),
                    dataIndex: 'price',
                    title: 'Price',
                    type: 'number',
                    rules: [{ required: true, message: 'Please input price!' }],
                    options: [],
                    filterable: true,
                    sortable: true
                },
                {
                    id: uuidv4(),
                    dataIndex: 'category',
                    title: 'Category',
                    type: 'select',
                    rules: [{ required: true, message: 'Please select category!' }],
                    options: [
                        { label: 'Electronics', value: 'Electronics' },
                        { label: 'Clothing', value: 'Clothing' },
                        { label: 'Food', value: 'Food' }
                    ],
                    filterable: true,
                    sortable: true
                },
                {
                    id: uuidv4(),
                    dataIndex: 'description',
                    title: 'Description',
                    type: 'textArea',
                    rules: [],
                    options: [],
                    filterable: false,
                    sortable: false
                }
            ],
            settings: {
                title: 'Product Catalog',
                layout: 'horizontal',
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
                modalTitle: 'Product Form',
                pageTitle: 'Product Catalog',
                gridColumns: 1
            }
        },
        {
            id: 'blank',
            name: 'Blank Form',
            icon: <FileAddOutlined />,
            description: 'Start with a blank form and add your own fields',
            fields: [],
            settings: {
                title: 'New Form',
                layout: 'horizontal',
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
                modalTitle: 'Data Form',
                pageTitle: 'Data Management',
                gridColumns: 1
            }
        }
    ];
    
    // Form builder state - use deep cloning to break potential circular references 
    const [formFields, setFormFields] = useState(() => JSON.parse(JSON.stringify(formTemplates[0].fields)));
    const [formSettings, setFormSettings] = useState(() => JSON.parse(JSON.stringify(formTemplates[0].settings)));
    const [activeTab, setActiveTab] = useState('1');
    const [fieldFormVisible, setFieldFormVisible] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [form] = Form.useForm();
    
    // Wizard state
    const [currentStep, setCurrentStep] = useState(0);
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
    const [selectedTemplate, setSelectedTemplate] = useState(formTemplates[0].id);
    const [currentFieldType, setCurrentFieldType] = useState(null);
    
    // Watch for field type changes
    useEffect(() => {
        if (!form || !fieldFormVisible) return;
        
        const type = form.getFieldValue('type');
        if (type !== currentFieldType) {
            setCurrentFieldType(type);
            
            // Check if this field type needs options
            const needsOptions = ['select', 'radio', 'tags', 'checkbox'].includes(type);
            const options = form.getFieldValue('options') || [];
            
            if (needsOptions && options.length === 0) {
                message.info('This field type requires options. Please add them in the Options tab.');
            }
        }
    }, [form, fieldFormVisible, currentFieldType]);
    
    // Handle template selection
    const handleTemplateSelect = (templateId) => {
        try {
            // Find the selected template
            const template = formTemplates.find(t => t.id === templateId);
            
            if (!template) {
                message.error('Invalid template selected');
                return;
            }
            
            // Confirm before changing if there are existing fields
            if (formFields.length > 0) {
                Modal.confirm({
                    title: 'Change Template?',
                    content: 'Changing template will replace your current form fields. Continue?',
                    onOk() {
                        // Update selected template
                        setSelectedTemplate(templateId);
                        
                        // Update form fields and settings with deep cloning to avoid circular references
                        setFormFields(JSON.parse(JSON.stringify(template.fields)));
                        setFormSettings(JSON.parse(JSON.stringify(template.settings)));
                        
                        message.success(`Template changed to ${template.name}`);
                    }
                });
            } else {
                // If no fields exist, just change the template
                setSelectedTemplate(templateId);
                setFormFields(JSON.parse(JSON.stringify(template.fields)));
                setFormSettings(JSON.parse(JSON.stringify(template.settings)));
                
                message.success(`Template changed to ${template.name}`);
            }
        } catch (error) {
            console.error('Error selecting template:', error);
            message.error('Failed to change template');
        }
    };
    
    // Field type options
    const fieldTypes = [
        { label: 'Text Input', value: 'input', icon: <FormOutlined /> },
        { label: 'Email', value: 'email', icon: <MailOutlined /> },
        { label: 'Text Area', value: 'textArea', icon: <FileTextOutlined /> },
        { label: 'Number', value: 'number', icon: <NumberOutlined /> },
        { label: 'Select', value: 'select', icon: <DownOutlined /> },
        { label: 'Date Picker', value: 'date', icon: <CalendarOutlined /> },
        { label: 'Date Range', value: 'dateRange', icon: <CalendarOutlined /> },
        { label: 'Checkbox', value: 'checkbox', icon: <CheckSquareOutlined /> },
        { label: 'Radio', value: 'radio', icon: <CheckCircleOutlined /> },
        { label: 'Tags', value: 'tags', icon: <TagsOutlined /> }
    ];
    
    // Common field presets for quick addition
    const fieldPresets = [
        {
            name: 'Name',
            dataIndex: 'name',
            title: 'Name',
            type: 'input',
            rules: [{ required: true, message: 'Please input name!' }],
            filterable: true,
            sortable: true,
            icon: <UserOutlined />
        },
        {
            name: 'Email Address',
            dataIndex: 'email',
            title: 'Email',
            type: 'email',
            rules: [
                { required: true, message: 'Please input email!' },
                { type: 'email', message: 'Please enter a valid email!' }
            ],
            filterable: true,
            sortable: true,
            icon: <MailOutlined />
        },
        {
            name: 'Phone Number',
            dataIndex: 'phone',
            title: 'Phone',
            type: 'input',
            rules: [{ required: false, message: 'Please input phone number!' }],
            filterable: true,
            sortable: true,
            icon: <PhoneOutlined />
        },
        {
            name: 'Status',
            dataIndex: 'status',
            title: 'Status',
            type: 'select',
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Pending', value: 'pending' }
            ],
            rules: [{ required: true, message: 'Please select status!' }],
            filterable: true,
            sortable: true,
            icon: <CheckCircleOutlined />
        },
        {
            name: 'Date Created',
            dataIndex: 'dateCreated',
            title: 'Date Created',
            type: 'date',
            rules: [],
            filterable: true,
            sortable: true,
            icon: <CalendarOutlined />
        },
        {
            name: 'Description',
            dataIndex: 'description',
            title: 'Description',
            type: 'textArea',
            rules: [],
            filterable: false,
            sortable: false,
            icon: <FileTextOutlined />
        }
    ];
    
    // Function to get field type icon
    const getFieldTypeIcon = (type) => {
        const fieldType = fieldTypes.find(t => t.value === type);
        return fieldType ? fieldType.icon : <FormOutlined />;
    };
    
    // Add a new field
    const handleAddField = () => {
        try {
            // Create a field with explicit properties to avoid circular references
            const newField = {
                id: uuidv4(),
                dataIndex: '',
                title: '',
                type: 'input',
                rules: [{ required: true, message: 'This field is required!' }],
                options: [],
                filterable: true,
                sortable: true
            };
            
            // Use a deep copy to break any potential references
            setCurrentField(JSON.parse(JSON.stringify(newField)));
            form.resetFields();
            setFieldFormVisible(true);
        } catch (error) {
            console.error('Error initializing new field:', error);
            message.error('Failed to initialize new field');
        }
    };
    
    // Add a preset field
    const handleAddPresetField = (preset) => {
        try {
            // Create a new object without potential circular references
            // by explicitly picking only the properties we need
            const sanitizedPreset = {
                name: preset.name,
                dataIndex: preset.dataIndex,
                title: preset.title,
                type: preset.type,
                rules: Array.isArray(preset.rules) ? [...preset.rules] : [],
                options: Array.isArray(preset.options) ? [...preset.options] : [],
                filterable: Boolean(preset.filterable),
                sortable: Boolean(preset.sortable)
            };
            
            const newField = {
                id: uuidv4(),
                ...sanitizedPreset
            };
            
            // Use functional updates to ensure we're using latest state
            setFormFields(prevFields => {
                // Create a safe copy of the fields first
                const safeFields = JSON.parse(JSON.stringify(prevFields));
                
                // Check for duplicate data indexes
                const baseDataIndex = newField.dataIndex;
                let dataIndex = baseDataIndex;
                let counter = 1;
                
                // If the field name already exists, add a number to make it unique
                while (safeFields.some(f => f.dataIndex === dataIndex)) {
                    dataIndex = `${baseDataIndex}${counter}`;
                    counter++;
                }
                
                newField.dataIndex = dataIndex;
                
                message.success(`"${newField.title}" field added`);
                return [...safeFields, newField];
            });
        } catch (error) {
            console.error('Error adding preset field:', error);
            message.error('Failed to add preset field');
        }
    };
    
    // Edit an existing field
    const handleEditField = (field) => {
        try {
            if (!field || !field.id) {
                message.error('Invalid field selected for editing');
                return;
            }
            
            // Create a proper deep copy to avoid reference issues
            // Using JSON.parse(JSON.stringify()) to break all potential circular references
            const fieldCopy = JSON.parse(JSON.stringify(field));
            setCurrentField(fieldCopy);
            
            // Set form values, explicitly extracting only the properties we need
            form.setFieldsValue({
                dataIndex: fieldCopy.dataIndex,
                title: fieldCopy.title,
                type: fieldCopy.type,
                required: fieldCopy.rules?.some(rule => rule.required) || false,
                filterable: fieldCopy.filterable || false,
                sortable: fieldCopy.sortable || false,
                options: Array.isArray(fieldCopy.options) ? fieldCopy.options : []
            });
            
            setFieldFormVisible(true);
        } catch (error) {
            console.error('Error editing field:', error);
            message.error('Failed to edit field');
        }
    };
    
    // Save field from form
    const handleSaveField = async () => {
        try {
            // Validate all form fields
            const values = await form.validateFields();
            
            if (!currentField || !currentField.id) {
                message.error('Missing field information');
                return;
            }
            
            // Create a clean field object with only the properties we need
            const fieldToSave = {
                id: currentField.id,
                dataIndex: values.dataIndex.trim(),
                title: values.title.trim(),
                type: values.type,
                rules: [
                    ...(values.required ? [{ required: true, message: `Please input ${values.title.trim()}!` }] : []),
                ],
                options: Array.isArray(values.options) ? [...values.options] : [],
                filterable: Boolean(values.filterable),
                sortable: Boolean(values.sortable)
            };
            
            // Use functional updates to ensure we're using latest state
            setFormFields(prevFields => {
                try {
                    // Create a safe copy of previous fields to avoid circular references
                    const safeFields = JSON.parse(JSON.stringify(prevFields));
                    
                    const existingField = safeFields.some(f => f.id === currentField.id);
                    
                    if (existingField) {
                        // Update existing field
                        message.success(`Field "${fieldToSave.title}" updated successfully`);
                        return safeFields.map(f => f.id === currentField.id ? fieldToSave : f);
                    } else {
                        // Add new field
                        message.success(`Field "${fieldToSave.title}" added successfully`);
                        return [...safeFields, fieldToSave];
                    }
                } catch (err) {
                    console.error('Error updating fields:', err);
                    message.error('An error occurred while saving the field');
                    return prevFields; // Return unchanged if there's an error
                }
            });
            
            setFieldFormVisible(false);
        } catch (error) {
            console.error('Validation failed:', error);
            message.error('Please check form fields and try again');
        }
    };
    
    // Delete a field
    const handleDeleteField = (fieldId) => {
        try {
            if (!fieldId) {
                message.error('Invalid field selected for deletion');
                return;
            }
            
            // Find the field to show in success message
            const fieldToDelete = formFields.find(field => field.id === fieldId);
            
            // Use functional update to ensure we're working with latest state
            setFormFields(prevFields => {
                // Remove field
                const updatedFields = prevFields.filter(field => field.id !== fieldId);
                // Show success message
                if (fieldToDelete) {
                    message.success(`Field "${fieldToDelete.title}" removed successfully`);
                }
                return updatedFields;
            });
            
        } catch (error) {
            console.error('Error deleting field:', error);
            message.error('Failed to delete field');
        }
    };
    
    // Component to render visual example of a field type
    const FieldTypeExample = ({ type }) => {
        // Sample data and components for each field type
        const examples = {
            input: <Input placeholder="Type here..." />,
            email: <Input placeholder="user@example.com" prefix={<MailOutlined />} />,
            textArea: <TextArea placeholder="Enter description..." rows={2} />,
            number: <InputNumber placeholder="0" min={0} />,
            select: (
                <Select 
                    placeholder="Select an option" 
                    options={[
                        { label: 'Option 1', value: '1' },
                        { label: 'Option 2', value: '2' }
                    ]}
                />
            ),
            date: <DatePicker style={{ width: '100%' }} />,
            dateRange: <DatePicker.RangePicker style={{ width: '100%' }} />,
            checkbox: <Checkbox.Group options={['Option 1', 'Option 2']} />,
            radio: (
                <Radio.Group>
                    <Radio value="1">Option 1</Radio>
                    <Radio value="2">Option 2</Radio>
                </Radio.Group>
            ),
            tags: (
                <Select 
                    mode="tags" 
                    placeholder="Select or add tags"
                    options={[
                        { label: 'Tag 1', value: 'tag1' },
                        { label: 'Tag 2', value: 'tag2' }
                    ]}
                    style={{ width: '100%' }}
                />
            )
        };
    
        return examples[type] || <Input disabled placeholder="Select a field type" />;
    };
    
    // Field type selection with visual examples
    const renderFieldTypeSelection = () => {
        const selectedType = form.getFieldValue('type') || 'input';
        
        const handleTypeSelect = (type) => {
            form.setFieldValue('type', type);
            
            // Reset options if switching to a type that doesn't use them
            if (!['select', 'radio', 'tags'].includes(type)) {
                form.setFieldValue('options', []);
            }
            
            // If switching to a type that uses options but none exist, add default ones
            if (['select', 'radio', 'tags'].includes(type) && 
                (!form.getFieldValue('options') || form.getFieldValue('options').length === 0)) {
                form.setFieldValue('options', [
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' }
                ]);
            }
        };
        
        const typeDescriptions = {
            input: "Standard text input for single-line text",
            email: "Email input with validation",
            textArea: "Multi-line text input for longer content",
            number: "Numeric input with increment/decrement controls",
            select: "Dropdown selection from predefined options",
            date: "Date picker with calendar popup",
            dateRange: "Date range selection with calendar popup",
            checkbox: "Multiple selection checkboxes",
            radio: "Single selection radio buttons",
            tags: "Multiple tags with ability to add custom values"
        };
        
        return (
            <>
                <div style={{ marginBottom: 16 }}>
                    <Text strong>Select Field Type</Text>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                        Choose how users will input data for this field
                    </Text>
                </div>
                
                <Row gutter={[16, 16]}>
                    {fieldTypes.map(type => (
                        <Col span={8} key={type.value}>
                            <Card
                                hoverable
                                size="small"
                                className={selectedType === type.value ? 'selected-type' : ''}
                                onClick={() => handleTypeSelect(type.value)}
                                style={{ 
                                    cursor: 'pointer',
                                    borderColor: selectedType === type.value ? '#1890ff' : '#f0f0f0',
                                    background: selectedType === type.value ? '#e6f7ff' : '#fff'
                                }}
                                title={
                                    <Space>
                                        {type.icon}
                                        <Text strong>{type.label}</Text>
                                    </Space>
                                }
                                extra={
                                    selectedType === type.value && (
                                        <CheckOutlined style={{ color: '#1890ff' }} />
                                    )
                                }
                            >
                                <Tooltip title={typeDescriptions[type.value]}>
                                    <div style={{ minHeight: 60 }}>
                                        <FieldTypeExample type={type.value} />
                                    </div>
                                </Tooltip>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </>
        );
    };
    
    // Live field preview based on current settings
    const renderFieldPreview = () => {
        const fieldValues = form.getFieldsValue();
        const { title, type, required } = fieldValues;
        const displayTitle = title || 'Field Label';
        
        return (
            <Card
                title="Live Preview"
                size="small"
                style={{ marginTop: 24, marginBottom: 24 }}
                extra={<InfoCircleOutlined />}
            >
                <Form layout={formSettings.layout}>
                    <Form.Item
                        label={displayTitle}
                        required={required}
                        tooltip={required ? "This field is required" : "This field is optional"}
                    >
                        <FieldTypeExample type={type} />
                    </Form.Item>
                </Form>
            </Card>
        );
    };
    
    // State for field form tabs
    const [currentFieldFormTab, setCurrentFieldFormTab] = useState('basic');
    
    // Check if the current field type needs options
    const checkNeedsOptions = () => {
        const currentType = form?.getFieldValue('type');
        return ['select', 'radio', 'tags', 'checkbox'].includes(currentType);
    };
    
    // Effect to update tab notification when field type changes - moved outside renderFieldForm
    useEffect(() => {
        // Skip if form is not available
        if (!form) return;
        
        const fieldType = form.getFieldValue('type');
        const needsOptions = ['select', 'radio', 'tags', 'checkbox'].includes(fieldType);
        const options = form.getFieldValue('options') || [];
        
        if (needsOptions && options.length === 0 && fieldFormVisible) {
            message.info('This field type requires options. Please add them in the Options tab.');
        }
    }, [fieldFormVisible, form]);
    
    // Field form for add/edit
    const renderFieldForm = () => {
        
        return (
            <Drawer
                title={currentField?.id ? 'Edit Field' : 'Add Field'}
                open={fieldFormVisible}
                onClose={() => setFieldFormVisible(false)}
                width={700}
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
                        type: 'input',
                        required: true,
                        filterable: true,
                        sortable: true,
                        options: []
                    }}
                >
                    <Tabs 
                                activeKey={currentFieldFormTab} 
                                onChange={setCurrentFieldFormTab}
                        items={[
                            {
                                key: 'basic',
                                label: (
                                    <span>
                                        <FormOutlined /> Basic Info
                                    </span>
                                ),
                                children: (
                                    <>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="dataIndex"
                                                    label="Field Name (dataIndex)"
                                                    rules={[
                                                        { required: true, message: 'Please input field name!' },
                                                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Field name can only contain letters, numbers and underscore' },
                                                        { min: 2, message: 'Field name must be at least 2 characters' }
                                                    ]}
                                                    tooltip="This will be used as the data index in code. Use camelCase naming (e.g. userName)"
                                                >
                                                    <Input 
                                                        placeholder="e.g. username, email, status" 
                                                        suffix={<QuestionCircleOutlined />}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="title"
                                                    label="Display Title"
                                                    rules={[
                                                        { required: true, message: 'Please input display title!' },
                                                        { min: 2, message: 'Title must be at least 2 characters' }
                                                    ]}
                                                    tooltip="This will be shown as column header and form label"
                                                >
                                                    <Input 
                                                        placeholder="e.g. Username, Email, Status" 
                                                        suffix={<QuestionCircleOutlined />}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Item
                                            name="type"
                                            hidden
                                        >
                                            <Input />
                                        </Form.Item>
                                        
                                        {renderFieldTypeSelection()}
                                        {renderFieldPreview()}
                                        
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="required"
                                                    valuePropName="checked"
                                                    label="Required"
                                                >
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="filterable"
                                                    valuePropName="checked"
                                                    label="Filterable"
                                                >
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="sortable"
                                                    valuePropName="checked"
                                                    label="Sortable"
                                                >
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </>
                                )
                            },
                            {
                                key: 'options',
                                label: (
                                    <span>
                                        <SettingOutlined /> Options
                                        {checkNeedsOptions() && 
                                            (form.getFieldValue('options')?.length === 0) && 
                                            <Badge count="!" style={{ backgroundColor: '#faad14', marginLeft: 5 }} />
                                        }
                                    </span>
                                ),
                                children: (
                                    <Form.List name="options">
                                        {(fields, { add, remove }) => {
                                            const selectedType = form.getFieldValue('type');
                                            const showOptions = ['select', 'radio', 'tags', 'checkbox'].includes(selectedType);
                                            
                                            if (!showOptions) {
                                                return (
                                                    <Empty
                                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                        description={
                                                            <span>
                                                                Options are only available for Select, Radio, Checkbox, and Tags field types.
                                                                <br />
                                                                <Button 
                                                                    type="link" 
                                                                    onClick={() => setCurrentTab('basic')}
                                                                >
                                                                    Change field type
                                                                </Button>
                                                            </span>
                                                        }
                                                    />
                                                );
                                            }
                                            
                                            return (
                                                <>
                                                    <Alert
                                                        message={`Configure options for your ${
                                                            selectedType === 'select' ? 'dropdown' : 
                                                            selectedType === 'radio' ? 'radio buttons' : 
                                                            'tags'
                                                        }`}
                                                        description="Add, edit or remove options that will be available to users"
                                                        type="info"
                                                        showIcon
                                                        style={{ marginBottom: 16 }}
                                                    />
                                                    
                                                    {fields.length === 0 ? (
                                                        <Empty
                                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                            description="No options added yet"
                                                            style={{ margin: '20px 0' }}
                                                        >
                                                            <Button
                                                                type="primary"
                                                                onClick={() => add({ label: 'New Option', value: 'newOption' })}
                                                                icon={<PlusOutlined />}
                                                            >
                                                                Add First Option
                                                            </Button>
                                                        </Empty>
                                                    ) : (
                                                        <div style={{ maxHeight: '400px', overflow: 'auto', padding: '8px 0' }}>
                                                            {fields.map((field, index) => (
                                                                <Card 
                                                                    key={field.key} 
                                                                    size="small" 
                                                                    style={{ marginBottom: 8 }}
                                                                    title={`Option ${index + 1}`}
                                                                    extra={
                                                                        <Button
                                                                            icon={<DeleteOutlined />}
                                                                            onClick={() => remove(field.name)}
                                                                            danger
                                                                            type="text"
                                                                        />
                                                                    }
                                                                >
                                                                    <Row gutter={16}>
                                                                        <Col span={12}>
                                                                            <Form.Item
                                                                                {...field}
                                                                                name={[field.name, 'label']}
                                                                                rules={[{ required: true, message: 'Missing label' }]}
                                                                                label="Label"
                                                                                tooltip="Text shown to users"
                                                                            >
                                                                                <Input placeholder="Display text" />
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col span={12}>
                                                                            <Form.Item
                                                                                {...field}
                                                                                name={[field.name, 'value']}
                                                                                rules={[{ required: true, message: 'Missing value' }]}
                                                                                label="Value"
                                                                                tooltip="Value stored in database"
                                                                            >
                                                                                <Input placeholder="Stored value" />
                                                                            </Form.Item>
                                                                        </Col>
                                                                    </Row>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    <Form.Item style={{ marginTop: 16 }}>
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
                                )
                            }
                        ]}
                    />
                </Form>
            </Drawer>
        );
    };
    
    // Duplicate a field
    const handleDuplicateField = (field) => {
        try {
            if (!field || !field.id) {
                message.error('Invalid field selected for duplication');
                return;
            }
            
            // Create a deep copy of the field
            const fieldCopy = JSON.parse(JSON.stringify(field));
            
            // Create a new field based on the copied one
            const newField = {
                ...fieldCopy,
                id: uuidv4(), // New unique ID
            };
            
            // Use functional updates to ensure we're using latest state
            setFormFields(prevFields => {
                // Create a safe copy of the fields first
                const safeFields = JSON.parse(JSON.stringify(prevFields));
                
                // Check for duplicate data indexes
                const baseDataIndex = newField.dataIndex;
                let dataIndex = `${baseDataIndex}Copy`;
                let counter = 1;
                
                // If the field name already exists, add a number to make it unique
                while (safeFields.some(f => f.dataIndex === dataIndex)) {
                    dataIndex = `${baseDataIndex}Copy${counter}`;
                    counter++;
                }
                
                newField.dataIndex = dataIndex;
                newField.title = `${newField.title} (Copy)`;
                
                message.success(`Field "${field.title}" duplicated`);
                return [...safeFields, newField];
            });
        } catch (error) {
            console.error('Error duplicating field:', error);
            message.error('Failed to duplicate field');
        }
    };
    
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
                            title="Edit Field"
                        />
                        <Button
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={() => handleDuplicateField(record)}
                            title="Duplicate Field"
                        />
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteField(record.id)}
                            title="Delete Field"
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
            try {
                // Validate input based on field type
                let validatedValue = value;
                
                // Special validation for numeric inputs
                if (['labelCol', 'wrapperCol'].includes(key) && typeof value === 'object') {
                    // Ensure span is a valid number between 1-24
                    const span = parseInt(value.span);
                    if (isNaN(span) || span < 1) {
                        validatedValue = { span: 1 };
                    } else if (span > 24) {
                        validatedValue = { span: 24 };
                    }
                }
                
                // Use functional update to ensure we're working with latest state
                setFormSettings(prevSettings => ({
                    ...prevSettings,
                    [key]: validatedValue
                }));
            } catch (error) {
                console.error('Error updating form settings:', error);
                message.error('Failed to update form settings');
            }
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
                
                <Form.Item label="Grid Layout Columns">
                    <Segmented
                        block
                        options={[
                            {
                                label: (
                                    <Tooltip title="Single Column">
                                        <div style={{ padding: '4px 0' }}>
                                            <BarsOutlined />
                                            <div>1 Column</div>
                                        </div>
                                    </Tooltip>
                                ),
                                value: 1
                            },
                            {
                                label: (
                                    <Tooltip title="Two Columns">
                                        <div style={{ padding: '4px 0' }}>
                                            <LayoutOutlined />
                                            <div>2 Columns</div>
                                        </div>
                                    </Tooltip>
                                ),
                                value: 2
                            },
                            {
                                label: (
                                    <Tooltip title="Three Columns">
                                        <div style={{ padding: '4px 0' }}>
                                            <TableOutlined />
                                            <div>3 Columns</div>
                                        </div>
                                    </Tooltip>
                                ),
                                value: 3
                            },
                            {
                                label: (
                                    <Tooltip title="Four Columns">
                                        <div style={{ padding: '4px 0' }}>
                                            <AppstoreOutlined />
                                            <div>4 Columns</div>
                                        </div>
                                    </Tooltip>
                                ),
                                value: 4
                            }
                        ]}
                        value={formSettings.gridColumns || 1}
                        onChange={(value) => handleSettingsChange('gridColumns', value)}
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

    return (
        <Card>
            <Title level={2}>Form Builder</Title>
            <Text>Design your user management form structure and generate code</Text>
            
            {/* Template selection */}
            <div style={{ marginBottom: 24 }}>
                <Card title="Form Template" size="small">
                    <div style={{ display: 'flex', overflowX: 'auto', gap: 16, padding: '8px 0' }}>
                        {formTemplates.map(template => (
                            <Card 
                                key={template.id}
                                hoverable
                                style={{ 
                                    width: 200, 
                                    border: selectedTemplate === template.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
                                    background: selectedTemplate === template.id ? '#e6f7ff' : '#fff'
                                }}
                                size="small"
                                onClick={() => handleTemplateSelect(template.id)}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                    <div style={{ fontSize: 24 }}>{template.icon}</div>
                                    <div style={{ fontWeight: 'bold' }}>{template.name}</div>
                                    <div style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>{template.description}</div>
                                    {selectedTemplate === template.id && (
                                        <Tag color="blue">Selected</Tag>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </Card>
            </div>
            
            <Tabs 
                defaultActiveKey="1"
                items={[
                    {
                        key: '1',
                        label: 'Fields',
                        children: (
                            <>
                                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddField}>
                                        Add Field
                                    </Button>
                                    <Tooltip title="Add common field presets">
                                        <Button icon={<ThunderboltOutlined />} type="default">
                                            Field Presets
                                        </Button>
                                    </Tooltip>
                                </div>
                                
                                {/* Field Presets Section */}
                                <div style={{ marginBottom: '16px' }}>
                                    <Card size="small" title="Common Field Presets" style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {fieldPresets.map(preset => (
                                                <Button 
                                                    key={preset.name}
                                                    icon={preset.icon}
                                                    onClick={() => handleAddPresetField(preset)}
                                                >
                                                    {preset.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                                
                                {renderFieldsTable()}
                            </>
                        )
                    },
                    {
                        key: '2',
                        label: 'Settings',
                        children: renderSettingsForm()
                    },
                    {
                        key: '3',
                        label: 'Preview',
                        children: (
                            <div>
                                <Alert
                                    message="Form Preview"
                                    description="This is a preview of how your form will look for data entry."
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                />
                                
                                <Card title={formSettings.modalTitle || "Form"}>
                                    <Form
                                        layout={formSettings.layout}
                                        labelCol={{ span: formSettings.labelCol?.span || 6 }}
                                        wrapperCol={{ span: formSettings.wrapperCol?.span || 18 }}
                                    >
                                        <Row gutter={[16, 16]}>
                                            {formFields.map(field => (
                                                <Col 
                                                    key={field.id} 
                                                    xs={24} 
                                                    sm={formSettings.gridColumns > 1 ? 12 : 24} 
                                                    md={24 / (formSettings.gridColumns || 1)}
                                                >
                                                    <Form.Item
                                                        label={field.title}
                                                        name={field.dataIndex}
                                                        required={field.rules?.some(rule => rule.required)}
                                                        tooltip={field.rules?.some(rule => rule.required) ? "This field is required" : "This field is optional"}
                                                    >
                                                        <FieldTypeExample type={field.type} />
                                                    </Form.Item>
                                                </Col>
                                            ))}
                                        </Row>
                                        
                                        <Form.Item wrapperCol={{ offset: formSettings.layout === 'horizontal' ? (formSettings.labelCol?.span || 6) : 0 }}>
                                            <Button type="primary" htmlType="submit">
                                                Submit
                                            </Button>
                                            <Button style={{ marginLeft: 8 }}>
                                                Cancel
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </div>
                        )
                    }
                ]}
            />
            
            <Divider />
            
            <div style={{ textAlign: 'right' }}>
                <Space>
                    <FormCodeGenerator
                        formFields={formFields}
                        formSettings={formSettings}
                        formTitle={formSettings.title}
                        tableName={formSettings.title.toLowerCase().replace(/\s+/g, '_')}
                    />
                </Space>
            </div>
            
            {renderFieldForm()}
        </Card>
    );
};

export default FormBuilder;
