'use client';
import React, { useEffect, useState } from 'react';
import { Card, message, Typography } from 'antd';
import CrudTable from '@/components/CrudTable';
import { useTitleContext } from '@/components/TitleContext';
import { DatabaseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '@/lib/api';
const { Text } = Typography;

export default function MasterProduct() {
  useTitleContext({ title: 'ข้อมูลสินค้า', icon: <DatabaseOutlined /> });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    columns: [
      {
        title: 'รหัสสินค้า',
        dataIndex: 'product_id',
        key: 'product_id',
        filterable: true,
      },
      {
        title: 'ชื่อภาษาไทย',
        dataIndex: 'product_name_thai',
        key: 'product_name_thai',
        filterable: true,
      },

      {
        title: 'หมวดหมู่ย่อย',
        dataIndex: 'sub_category',
        key: 'sub_category',
        filterable: true,
        filters: [
          {
            text: 'Option 1',
            value: 'option1',
          },
          {
            text: 'Option 2',
            value: 'option2',
          },
        ],
        onFilter: (value, record) => record.sub_category === value,
      },
      {
        title: 'สถานะ',
        dataIndex: 'status',
        key: 'status',
        filterable: true,
        filters: [
          {
            text: 'Active',
            value: 'active',
          },
          {
            text: 'Inactive',
            value: 'inactive',
          },
          {
            text: 'Pending',
            value: 'pending',
          },
        ],
        onFilter: (value, record) => record.status === value,
      },
      {
        title: 'ผู้บันทึก',
        dataIndex: 'created_by',
        key: 'created_by',
        filterable: true,
      },
      {
        title: 'วันที่บันทึกล่าสุด',
        dataIndex: 'created_at',
        key: 'created_at',
        filterable: true,
        render: text => {
          return text ? dayjs(text).format('YYYY-MM-DD') : '';
        },
        sorter: true,
      },
    ],
    form: {
      settings: {
        title: 'MasterProduct Form',
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        layout: 'horizontal',
        gridColumns: 2,
      },
      fields: [
        {
          dataIndex: 'product_id',
          label: 'รหัสสินค้า',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input รหัสสินค้า!',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'status',
          label: 'สถานะ',
          type: 'select',
          rules: [
            {
              required: true,
              message: 'Please input สถานะ!',
            },
          ],
          options: [
            {
              label: 'Active',
              value: 'active',
            },
            {
              label: 'Inactive',
              value: 'inactive',
            },
            {
              label: 'Pending',
              value: 'pending',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'product_name_thai',
          label: 'ชื่อภาษาไทย',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input ชื่อภาษาไทย!',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'product_name_eng',
          label: 'ชื่อภาษาอังกฤษ',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input ชื่อภาษาอังกฤษ!',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'normal_price',
          label: 'ราคาขายทั่วไป',
          type: 'number',
          rules: [
            {
              required: true,
              message: 'Please input ราคาขายทั่วไป!',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'employee_price',
          label: 'ราคาขายพนักงาน',
          type: 'number',
          rules: [
            {
              required: true,
              message: 'Please input ราคาขายพนักงาน!',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'tax',
          label: 'ภาษี',
          type: 'radio',
          rules: [
            {
              required: true,
              message: 'Please input ภาษี!',
            },
          ],
          options: [
            {
              label: 'เสียภาษี',
              value: 'tax',
            },
            {
              label: 'ไม่เสียภาษี',
              value: 'no_tax',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'sub_category',
          label: 'หมวดหมู่ย่อย',
          type: 'select',
          rules: [
            {
              required: true,
              message: 'Please input หมวดหมู่ย่อย!',
            },
          ],
          options: [
            {
              label: 'Option 1',
              value: 'option1',
            },
            {
              label: 'Option 2',
              value: 'option2',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'stock',
          label: 'stock',
          type: 'radio',
          rules: [
            {
              required: true,
              message: 'Please input stock!',
            },
          ],
          options: [
            {
              label: 'มี Stock',
              value: 'in_stock',
            },
            {
              label: 'ไม่มี Stock',
              value: 'out_stock',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'category',
          label: 'หมวดหมู่',
          type: 'select',
          rules: [
            {
              required: true,
              message: 'Please input หมวดหมู่!',
            },
          ],
          options: [
            {
              label: 'Option 1',
              value: 'option1',
            },
            {
              label: 'Option 2',
              value: 'option2',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'total_stock',
          label: 'จำนวน stock',
          type: 'number',
          rules: [
            {
              required: true,
              message: 'Please input จำนวน stock!',
            },
          ],
          cardGroup: 'master_product',
        },
        {
          dataIndex: 'image',
          label: 'รูปภาพ',
          type: 'image',
          rules: [
            {
              required: true,
              message: 'Please input รูปภาพ!',
            },
          ],
          cardGroup: 'master_product',
        },
      ],
      cardGroupSetting: [
        {
          key: 'master_product',
          title: 'Add Master Product',
          description: 'test-master-product',
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
    filters: {
      fields: [
        {
          title: 'สถานะ',
          field: ['status'],
          type: 'select',
          options: [
            {
              label: 'ใช้งาน',
              value: 'active',
            },
            {
              label: 'ไม่ใช้งาน',
              value: 'inactive',
            },
            {
              label: 'ยกเลิก',
              value: 'cancel',
            },
          ],
        },
        {
          title: 'ค้นหา',
          field: ['product_name_thai', 'product_name_eng'],
          type: 'text',
          options: [],
        },
      ],
    },
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
        const response = await api.get('master/master-product');
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
      const res = await api.post('master/master-product', newRecord);
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
        await api.put(`master/master-product`, {
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
        keys.map(key => api.delete(`master/master-product`, { id: key })),
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
        `master-product-export-${dayjs().format('YYYY-MM-DD')}.csv`,
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
        title="ข้อมูลสินค้า"
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
