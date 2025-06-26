'use client';
import React, { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import CrudTable from '@/components/CrudTable';
import { useTitleContext } from '@/components/TitleContext';
import { DatabaseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '@/lib/api';

export default function MasterBranchDetailPage() {
  useTitleContext({ title: 'ข้อมูลสาขา', icon: <DatabaseOutlined /> });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    columns: [
      {
        title: 'รหัสสาขา',
        dataIndex: 'branch_id',
        key: 'branch_id',
        filterable: true,
      },
      {
        title: 'ชื่อสาขา',
        dataIndex: 'branch_name_thai',
        key: 'branch_name_thai',
        filterable: true,
      },
      {
        title: 'รายละเอียดสาขา',
        dataIndex: 'branch_detail',
        key: 'branch_detail',
        filterable: true,
      },
      {
        title: 'ผู้จัดการ',
        dataIndex: 'manager',
        key: 'manager',
        filterable: true,
      },
      {
        title: 'เบอร์โทรศัพท์',
        dataIndex: 'phone_number',
        key: 'phone_number',
        filterable: true,
      },
      {
        title: 'สถานะ',
        dataIndex: 'status',
        key: 'status',
        filterable: true,
        filters: [
          {
            text: 'ใช้งาน',
            value: 'active',
          },
          {
            text: 'ไม่ใช้งาน',
            value: 'inactive',
          },
          {
            text: 'ยกเลิก',
            value: 'cancel',
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
        title: 'Master Branch Detail Form',
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        layout: 'horizontal',
        gridColumns: 1,
      },
      fields: [
        {
          dataIndex: 'branch_type',
          label: 'ประเภทสาขา',
          type: 'radio',
          options: [
            {
              label: 'สาขา',
              value: 'sub-branch',
            },
            {
              label: 'สำนักงานใหญ่',
              value: 'main-branch',
            },
          ],
          rules: [
            {
              required: true,
              message: 'Please input ประเภทสาขา!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'status',
          label: 'สถานะ',
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
          rules: [
            {
              required: true,
              message: 'Please input สถานะ!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'branch_id',
          label: 'รหัสสาขา',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input รหัสสาขา!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'revenue_id',
          label: 'รหัสที่ออกโดยสรรพากร',
          type: 'input',
          rules: [
            {
              required: false,
              message: 'Please input รหัสที่ออกโดยสรรพากร!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'branch_name_thai',
          label: 'ชื่อภาษาไทย',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input ชื่อภาษาไทย!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'taxpayer_number',
          label: 'เลขที่ผู้เสียภาษีอากร',
          type: 'input',
          rules: [
            {
              required: false,
              message: 'Please input เลขที่ผู้เสียภาษีอากร!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'branch_name_eng',
          label: 'ชื่อภาษาอังกฤษ',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input ชื่อภาษาอังกฤษ!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'branch_detail',
          label: 'รายละเอียดสาขา',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input รายละเอียดสาขา!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'open_date',
          label: 'วันที่เปิด',
          type: 'date',
          rules: [
            {
              required: false,
              message: 'Please input วันที่เปิด!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          type: 'blank',
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'close_date',
          label: 'วันที่ปิด',
          type: 'date',
          rules: [
            {
              required: false,
              message: 'Please input วันที่ปิด!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'manager',
          label: 'ผู้จัดการสาขา',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input ผู้จัดการสาขา!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'region',
          label: 'ภูมิภาค',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input ภูมิภาค!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'phone_number',
          label: 'เบอร์โทรศัพท์',
          type: 'input',
          rules: [
            {
              required: true,
              message: 'Please input เบอร์โทรศัพท์!',
            },
          ],
          cardGroup: 'branch_detail',
        },
        {
          dataIndex: 'eod',
          label: 'การปิดระบบสิ้นวัน',
          type: 'radio',
          options: [
            {
              label: 'ด้วยตัวเอง',
              value: 'manual',
            },
            {
              label: 'อัตโนมัติ',
              value: 'auto',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input การปิดระบบสิ้นวัน!',
            },
          ],
          cardGroup: 'setting_branch',
        },
        {
          dataIndex: 'switch_branch',
          label: 'การใช้งานข้ามสาขา',
          type: 'radio',
          options: [
            {
              label: 'ไม่ข้ามสาขา',
              value: 'no',
            },
            {
              label: 'ข้ามสาขา',
              value: 'yes',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input การใช้งานข้ามสาขา!',
            },
          ],
          cardGroup: 'setting_branch',
        },
        {
          dataIndex: 'time_eod',
          label: 'เวลาปิดระบบสิ้นวัน',
          type: 'input',
          rules: [
            {
              required: false,
              message: 'Please input เวลาปิดระบบสิ้นวัน!',
            },
          ],
          cardGroup: 'setting_branch',
        },
        {
          dataIndex: 'tax',
          label: 'การจดภาษี',
          type: 'checkbox',
          options: [
            {
              label: 'แคชเชียร์',
              value: 'cashier',
            },
            {
              label: 'ร้านค้า',
              value: 'retail',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input การจดภาษี!',
            },
          ],
          cardGroup: 'setting_branch',
        },
        {
          dataIndex: 'company_name',
          label: 'ชื่อบริษัท',
          type: 'input',
          rules: [
            {
              required: false,
              message: 'Please input ชื่อบริษัท!',
            },
          ],
          cardGroup: 'header_print_tax',
        },
        {
          dataIndex: 'header_slip_name',
          label: 'ชื่อหัว Slip',
          type: 'input',
          rules: [
            {
              required: false,
              message: 'Please input ชื่อหัว Slip!',
            },
          ],
          cardGroup: 'header_print_tax',
        },
        {
          dataIndex: 'address_tax_invoice',
          label: 'ที่อยู่สำหรับออกใบกำกับภาษี',
          type: 'textArea',
          rules: [
            {
              required: false,
              message: 'Please input ที่อยู่สำหรับออกใบกำกับภาษี!',
            },
          ],
          cardGroup: 'header_print_tax',
        },
        {
          dataIndex: 'message_slip_thai',
          label: 'ข้อความ Slip ภาษาไทย',
          type: 'input',
          rules: [
            {
              required: false,
              message: 'Please input ข้อความ Slip ภาษาไทย!',
            },
          ],
          cardGroup: 'header_print_tax',
        },
        {
          dataIndex: 'message_slip_eng',
          label: 'ข้อความ Slip ภาษาอังกฤษ',
          type: 'input',
          rules: [
            {
              required: false,
              message: 'Please input ข้อความ Slip ภาษาอังกฤษ!',
            },
          ],
          cardGroup: 'header_print_tax',
        },
        {
          dataIndex: 'print_sell_card',
          label: 'เงื่อนไขพิมพ์ขายบัตร',
          type: 'radio',
          options: [
            {
              label: 'พิมพ์',
              value: 'yes',
            },
            {
              label: 'ไม่พิมพ์',
              value: 'no',
            },
            {
              label: 'มี popup',
              value: 'popup',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input เงื่อนไขพิมพ์ขายบัตร!',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'print_topup',
          label: 'เงื่อนไขพิมพ์เติมเงิน',
          type: 'radio',
          options: [
            {
              label: 'พิมพ์',
              value: 'yes',
            },
            {
              label: 'ไม่พิมพ์',
              value: 'no',
            },
            {
              label: 'มี popup',
              value: 'popup',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input เงื่อนไขพิมพ์เติมเงิน!',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'total_print_sell_card',
          label: 'จำนวนการพิมพ์',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input จำนวนการพิมพ์!',
            },
          ],
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'total_print_topup',
          label: 'จำนวนการพิมพ์',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input จำนวนการพิมพ์เติมเงิน!',
            },
          ],
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'print_return_card',
          label: 'เงื่อนไขพิมพ์คืนบัตร',
          type: 'radio',
          options: [
            {
              label: 'พิมพ์',
              value: 'yes',
            },
            {
              label: 'ไม่พิมพ์',
              value: 'no',
            },
            {
              label: 'มี popup',
              value: 'popup',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input เงื่อนไขพิมพ์คืนบัตร!',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'print_cancel_sell',
          label: 'เงื่อนไขพิมพ์ยกเลิกการขาย',
          type: 'radio',
          options: [
            {
              label: 'พิมพ์',
              value: 'yes',
            },
            {
              label: 'ไม่พิมพ์',
              value: 'no',
            },
            {
              label: 'มี popup',
              value: 'popup',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input เงื่อนไขพิมพ์ยกเลิกการขาย!',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'total_return_card',
          label: 'จำนวนการพิมพ์',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input จำนวนการพิมพ์คืนบัตร!',
            },
          ],
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'total_cancel_sell',
          label: 'จำนวนการพิมพ์',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input จำนวนการพิมพ์ยกเลิกการขาย!',
            },
          ],
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'print_cash_in_out',
          label: 'เงื่อนไขพิมพ์นำเงินเข้า/ออก',
          type: 'radio',
          options: [
            {
              label: 'พิมพ์',
              value: 'yes',
            },
            {
              label: 'ไม่พิมพ์',
              value: 'no',
            },
            {
              label: 'มี popup',
              value: 'popup',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input เงื่อนไขพิมพ์นำเงินเข้า/ออก!',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'print_card_in_out',
          label: 'เงื่อนไขพิมพ์นำบัตรเข้า/ออก',
          type: 'radio',
          options: [
            {
              label: 'พิมพ์',
              value: 'yes',
            },
            {
              label: 'ไม่พิมพ์',
              value: 'no',
            },
            {
              label: 'มี popup',
              value: 'popup',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input เงื่อนไขพิมพ์นำบัตรเข้า/ออก!',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'total_cash_in_out',
          label: 'จำนวนการพิมพ์',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input จำนวนการพิมพ์นำเงินเข้า/ออก!',
            },
          ],
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'total_card_in_out',
          label: 'จำนวนการพิมพ์',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input จำนวนการพิมพ์นำบัตรเข้า/ออก!',
            },
          ],
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'print_sum_total_cashier',
          label: 'เงื่อนไขพิมพ์สรุปยอดแคชเชียร์',
          type: 'radio',
          options: [
            {
              label: 'พิมพ์',
              value: 'yes',
            },
            {
              label: 'ไม่พิมพ์',
              value: 'no',
            },
            {
              label: 'มี popup',
              value: 'popup',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input เงื่อนไขพิมพ์สรุปยอดแคชเชียร!',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'print_sum_total_sell',
          label: 'รูปแบบการพิมพ์สรุปยอดขาย',
          type: 'radio',
          options: [
            {
              label: 'ระบุเป็นจำนวนแบงค์',
              value: 'bank',
            },
            {
              label: 'ระบุยอดเงิน',
              value: 'money',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input รูปแบบการพิมพ์สรุปยอดขาย!',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'total_sum_total_cashier',
          label: 'จำนวนการพิมพ์',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input จำนวนการพิมพ์สรุปยอดแคชเชียร!',
            },
          ],
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          cardGroup: 'setting_type_cashier',
        },
        {
          dataIndex: 'print_slip_retail',
          label: 'เงื่อนไขพิมพ์สลิปร้านค้า',
          type: 'radio',
          options: [
            {
              label: 'พิมพ์',
              value: 'yes',
            },
            {
              label: 'ไม่พิมพ์',
              value: 'no',
            },
            {
              label: 'มี popup',
              value: 'popup',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input เงื่อนไขพิมพ์สลิปร้านค้า!',
            },
          ],
          cardGroup: 'setting_type_retail',
        },
        {
          dataIndex: 'print_cancel_retail',
          label: 'เงื่อนไขพิมพ์ยกเลิก',
          type: 'radio',
          options: [
            {
              label: 'พิมพ์',
              value: 'yes',
            },
            {
              label: 'ไม่พิมพ์',
              value: 'no',
            },
            {
              label: 'มี popup',
              value: 'popup',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input เงื่อนไขพิมพ์ยกเลิก!',
            },
          ],
          cardGroup: 'setting_type_retail',
        },
        {
          dataIndex: 'total_slip_retail',
          label: 'จำนวนการพิมพ์',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input จำนวนการพิมพ์สลิปร้านค้า!',
            },
          ],
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          cardGroup: 'setting_type_retail',
        },
        {
          dataIndex: 'total_cancel_retail',
          label: 'จำนวนการพิมพ์',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input จำนวนการพิมพ์ยกเลิก!',
            },
          ],
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          cardGroup: 'setting_type_retail',
        },
        {
          dataIndex: 'print_sum_total_retail',
          label: 'เงื่อนไขพิมพ์สรุปยอดขายร้านค้า',
          type: 'radio',
          options: [
            {
              label: 'พิมพ์',
              value: 'yes',
            },
            {
              label: 'ไม่พิมพ์',
              value: 'no',
            },
            {
              label: 'มี popup',
              value: 'popup',
            },
          ],
          rules: [
            {
              required: false,
              message: 'Please input เงื่อนไขพิมพ์สรุปยอดขายร้านค้า!',
            },
          ],
          cardGroup: 'setting_type_retail',
        },
        {
          type: 'blank',
          cardGroup: 'setting_type_retail',
        },
        {
          dataIndex: 'total_sum_total_retail',
          label: 'จำนวนการพิมพ์',
          type: 'select',
          rules: [
            {
              required: false,
              message: 'Please input จำนวนการพิมพ์สรุปยอดขายร้านค้า!',
            },
          ],
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          cardGroup: 'setting_type_retail',
        },
      ],
      cardGroupSetting: [
        {
          key: 'branch_detail',
          title: 'Add Branch Detail',
          description: 'test-branch-detail',
          labelCol: {
            span: 6,
          },
          wrapperCol: {
            span: 15,
          },
          layout: 'horizontal',
          gridColumns: 2,
        },
        {
          key: 'setting_branch',
          title: 'Setting Branch',
          description: '',
          labelCol: {
            span: 6,
          },
          wrapperCol: {
            span: 15,
          },
          layout: 'horizontal',
          gridColumns: 2,
        },
        {
          key: 'header_print_tax',
          title: 'Header Print Tax',
          description: '',
          labelCol: {
            span: 6,
          },
          wrapperCol: {
            span: 15,
          },
          layout: 'horizontal',
          gridColumns: 2,
        },
        {
          key: 'setting_type_cashier',
          title: 'Setting Type (Cashier)',
          description: 'Cashier',
          labelCol: {
            span: 6,
          },
          wrapperCol: {
            span: 15,
          },
          layout: 'horizontal',
          gridColumns: 2,
        },
        {
          key: 'setting_type_retail',
          title: 'Setting Type (Retail)',
          description: 'Retail',
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
        const response = await api.get('master/master-branch-detail');
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
      const recordToSend = { ...newRecord };
      recordToSend.created_at = dayjs().format('YYYY-MM-DD HH:mm:ss');
      recordToSend.created_by = newRecord.manager;

      const res = await api.post('master/master-branch-detail', recordToSend);

      if (res.data && res.data.success === false) {
        return res.data; // Return error response
      }

      setData([...data, res.data]);
      return res.data; // Return success response
    } catch (error) {
      // Handle error response
      console.error('Error adding record:', error);
      if (error.response && error.response.data) {
        console.error('Error details:', error.response.data);
        return {
          success: false,
          message: error.response.data.message || 'Failed to add record',
        };
      }
      return {
        success: false,
        message: 'Failed to add record. Please try again.',
      };
    }
  };

  const handleEdit = (data, setData) => async (key, updatedRecord) => {
    try {
      const newData = [...data];
      const index = newData.findIndex(item => item.id === key);
      if (index > -1) {
        const recordToSend = { ...updatedRecord };
        recordToSend.created_by = updatedRecord.manager;

        const res = await api.put(`master/master-branch-detail`, {
          body: recordToSend,
          where: { id: key },
        });

        if (res.data && res.data.success === false) {
          return res.data; // Return error response
        }

        newData[index] = { ...newData[index], ...recordToSend };
        setData(newData);
        return res.data; // Return success response
      }
    } catch (error) {
      console.error('Error updating record:', error);
      return {
        success: false,
        message: 'Failed to update record. Please try again.',
      };
    }
  };

  const handleDelete = (data, setData) => async keys => {
    try {
      await Promise.all(
        keys.map(key => api.delete(`master/master-branch-detail`, { id: key })),
      );
      const newData = data.filter(item => !keys.includes(item.id));
      setData(newData);
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
      link.setAttribute('download', `master-export-${dayjs().format('YYYY-MM-DD')}.csv`);
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
        title="Master Branch Detail"
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
