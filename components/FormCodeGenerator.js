'use client';
import React, { useState } from 'react';
import { Tabs, Button, Modal, message, Space, Typography, Card } from 'antd';
import { CopyOutlined, DownloadOutlined, CodeOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const FormCodeGenerator = ({ formFields, formTitle, tableName }) => {
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
                labelCol: {span: 6},
                wrapperCol: {span: 24},
                cols: 12,
                layout: 'horizontal',
                mode: 'modal'
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

export default FormCodeGenerator;
