'use client';

import React, { useState } from 'react';

import {
  Typography,
  InputNumber,
  Card,
  Row,
  Col,
  Layout,
  Table,
  Pagination,
  Select,
} from 'antd';
import { ResponsiveContainer } from 'recharts';

const { Content } = Layout;
const { Title, Text } = Typography;

const mallSalesColumns = [
  {
    title: 'รหัสสาขา',
    dataIndex: 'branchId',
    key: 'branchId',
    width: 80,
    align: 'center',
  },
  {
    title: 'ชื่อสาขา',
    dataIndex: 'branchName',
    key: 'branchName',
    width: 120,
  },
  {
    title: 'รหัสพื้นที่เช่า',
    dataIndex: 'areaCode',
    key: 'areaCode',
    width: 100,
    align: 'center',
  },
  {
    title: 'รหัสร้านค้า',
    dataIndex: 'shopCode',
    key: 'shopCode',
    width: 100,
    align: 'center',
  },
  {
    title: 'ชื่อร้านค้า',
    dataIndex: 'shopName',
    key: 'shopName',
    width: 140,
  },
  {
    title: 'วันที่สิ้นสุด',
    dataIndex: 'endDate',
    key: 'endDate',
    width: 110,
    align: 'center',
  },
  {
    title: 'สถานะ',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    align: 'center',
    render: text => (
      <span
        style={{
          color:
            text === 'ใกล้หมดสัญญา' ? '#d32f2f' : text === 'ว่าง' ? '#388e3c' : undefined,
        }}
      >
        {text}
      </span>
    ),
  },
];

const mallSalesData = [
  {
    key: 1,
    branchId: '2097',
    branchName: 'รัตนาธิเบศร์',
    areaCode: 'FC01',
    shopCode: 'TM01',
    shopName: 'ร้านข้าวมันไก่',
    endDate: '18/04/2025',
    status: 'ใกล้หมดสัญญา',
  },
  {
    key: 2,
    branchId: '2097',
    branchName: 'รัตนาธิเบศร์',
    areaCode: 'FC02',
    shopCode: 'TM02',
    shopName: 'ร้านราดหน้า',
    endDate: '20/04/2025',
    status: 'ใกล้หมดสัญญา',
  },
  {
    key: 3,
    branchId: '2098',
    branchName: 'ลาวพร้าว',
    areaCode: 'LP11',
    shopCode: 'TM03',
    shopName: 'ตามสั่ง',
    endDate: '19/04/2025',
    status: 'ใกล้หมดสัญญา',
  },
  {
    key: 4,
    branchId: '2098',
    branchName: 'ลาวพร้าว',
    areaCode: 'LP12',
    shopCode: '',
    shopName: '',
    endDate: '',
    status: 'ว่าง',
  },
  {
    key: 5,
    branchId: '2098',
    branchName: 'บางบ่อ',
    areaCode: 'BB01',
    shopCode: 'TM04',
    shopName: 'ร้านข้าวมันไก่',
    endDate: '19/04/2025',
    status: 'ใกล้หมดสัญญา',
  },
  {
    key: 6,
    branchId: '2099',
    branchName: 'บางบอน',
    areaCode: 'BB02',
    shopCode: 'TM05',
    shopName: 'ร้านข้าวมันไก่',
    endDate: '19/04/2025',
    status: 'ใกล้หมดสัญญา',
  },
  {
    key: 7,
    branchId: '2100',
    branchName: 'บางขุนเทียน',
    areaCode: 'BB03',
    shopCode: 'TM04',
    shopName: 'ร้านข้าวมันไก่',
    endDate: '19/04/2025',
    status: 'ใกล้หมดสัญญา',
  },
];

export default function MallSalesPage() {
  const [topN, setTopN] = useState(10);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const total = 171; // ตัวอย่าง total จริงควรดึงจาก backend

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <Content style={{ padding: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <Card>
        <Row align="middle" gutter={16}>
          <Col>
            <Title level={4} style={{ color: '#2196f3' }}>
              ร้านค้าใกล้หมดสัญญา และพื้นที่เช่าว่าง
            </Title>
          </Col>
          <Col flex="auto" />
          <Row align="middle" gutter={16}>
            <Col>
              <Text>แสดงร้านค้าใกล้หมดสัญญา</Text>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={mallSalesData.length}
                value={topN}
                onChange={setTopN}
                style={{ width: 60 }}
              />
            </Col>
            <Col>
              <Text>วัน</Text>
            </Col>
          </Row>
        </Row>

        <div style={{ borderBottom: '1px solid #e0e0e0', margin: '16px 0' }} />

        <ResponsiveContainer width="100%" height={400}>
          <div
            style={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              background: '#fff',
            }}
          >
            {/* change color of table header and footer */}
            <Table
              columns={mallSalesColumns}
              dataSource={mallSalesData.slice((page - 1) * pageSize, page * pageSize)}
              pagination={false}
              bordered
              size="small"
              scroll={{ x: 800 }}
              footer={() => (
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 8 }}>รายการต่อหน้า</span>
                    <Select
                      value={pageSize}
                      onChange={value => handlePageChange(1, value)}
                      style={{ width: 64, marginRight: 12 }}
                      options={[
                        { value: 10, label: '10' },
                        { value: 20, label: '20' },
                        { value: 50, label: '50' },
                      ]}
                    />
                    <span style={{ color: '#1976d2', fontSize: 14 }}>
                      {`แสดงผล ${(page - 1) * pageSize + 1} ถึง ${Math.min(
                        page * pageSize,
                        total,
                      )} จาก ${total} รายการ`}
                    </span>
                  </div>
                  <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger={false}
                    onChange={handlePageChange}
                    style={{ background: 'transparent' }}
                  />
                </div>
              )}
            />
          </div>
        </ResponsiveContainer>
      </Card>
    </Content>
  );
}
