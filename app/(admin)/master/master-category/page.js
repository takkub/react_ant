'use client';
import React, { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import CrudTable from '@/components/CrudTable';
import { useTitleContext } from '@/components/TitleContext';
import { DatabaseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '@/lib/api';

export default function MasterCategory() {
  useTitleContext({ title: 'ข้อมูลหมวดหมู่สินค้า', icon: <DatabaseOutlined /> });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    columns: [
      {
        title: 'รหัส หมวดหมู่สินค้า',
        dataIndex: 'category_id',
        key: 'category_id',
        filterable: true,
      },
      {
        title: 'สถานะ',
        dataIndex: 'status',
        key: 'status',
        filterable: true,
        filters: [],
        onFilter: (value, record) => record.status === value,
      },
      {
        title: 'ชื่อภาษาไทย',
        dataIndex: 'category_name_thai',
        key: 'category_name_thai',
        filterable: true,
      },
      {
        title: 'ชื่อภาษาอังกฤษ',
        dataIndex: 'category_name_eng',
        key: 'category_name_eng',
        filterable: true,
      },
    ],
    form: {
      settings: {
        title: 'New Form Form',
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        layout: 'horizontal',
        gridColumns: 2,
      },
      fields: [
        {
          dataIndex: 'category_id',
          label: 'รหัส หมวดหมู่สินค้า',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input รหัส หมวดหมู่สินค้า!',
            },
          ],
          cardGroup: 'master_category',
        },
        {
          dataIndex: 'status',
          label: 'สถานะ',
          type: 'select',
          options: [
            { label: 'ใช้งาน', value: 'active', text: 'ใช้งาน' },
            { label: 'ไม่ใช้งาน', value: 'inactive', text: 'ไม่ใช้งาน' },
          ],
          rules: [
            {
              required: true,
              message: 'Please input สถานะ!',
            },
          ],
          cardGroup: 'master_category',
        },
        {
          dataIndex: 'category_name_thai',
          label: 'ชื่อภาษาไทย',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input ชื่อภาษาไทย!',
            },
          ],
          cardGroup: 'master_category',
        },
        {
          dataIndex: 'category_name_eng',
          label: 'ชื่อภาษาอังกฤษ',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input ชื่อภาษาอังกฤษ!',
            },
          ],
          cardGroup: 'master_category',
        },
      ],
      cardGroupSetting: [
        {
          key: 'master_category',
          title: 'Add Master Category',
          description: 'test-master-category',
          labelCol: {
            span: 6,
          },
          wrapperCol: {
            span: 15,
          },
          layout: 'horizontal',
          gridColumns: 2,
        },
      ],
    },
    filters: [
      {
        title: 'Search',
        field: ['name'],
        type: 'text',
        options: [],
      },
    ],
    pagination: {
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      showQuickJumper: true,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('master/master-category');
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

  const handleAdd = (data, setData) => async newRecord => {
    try {
      const res = await api.post('master/master-category', newRecord);
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
        await api.put(`master/master-category`, {
          body: updatedRecord,
          where: { id: key },
        });
        newData[index] = { ...newData[index], ...updatedRecord };
        setData(newData);
        message.success(`Record updated successfully`);
      }
    } catch (error) {
      console.error('Error updating record:', error);
      message.error('Failed to update record. Please try again.');
    }
  };

  const handleDelete = (data, setData) => async keys => {
    try {
      await Promise.all(
        keys.map(key => api.delete(`master/master-category`, { id: key })),
      );
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
      const dataToExport =
        selectedKeys.length > 0
          ? allData.filter(item => selectedKeys.includes(item.key))
          : allData;

      const headers = options.columns.map(col => col.title).join(',');
      const csvRows = dataToExport.map(item => {
        return options.columns
          .map(col => {
            if (Array.isArray(item[col.dataIndex])) {
              return `"${item[col.dataIndex].join(', ')}"`;
            } else if (col.dataIndex === 'createdAt' && item[col.dataIndex]) {
              return dayjs(item[col.dataIndex]).format('YYYY-MM-DD');
            }
            return `"${item[col.dataIndex] || ''}"`;
          })
          .join(',');
      });

      const csvString = [headers, ...csvRows].join('\n');

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `master-category-export-${dayjs().format('YYYY-MM-DD')}.csv`,
      );
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
        title="Master Category"
        data={data}
        setData={setData}
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
