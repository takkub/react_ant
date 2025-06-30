'use client';
import React, { useState } from 'react';
import { Layout, Typography, Select, Row, Col, Space } from 'antd';
import { useTitleContext } from '@/components/TitleContext';
import { DashboardOutlined } from '@ant-design/icons';
import CashierRetailPage from './cashier-retail/page';
import MenuPage from './menu/page';
import RetailPage from './retail/page';
import PromotionPage from './promotion/page';
import MallSalesPage from './mallSales/page';
import CashierRetailPerHourPage from './cashier-retail-perHour/page';

const { Header } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function DashboardPage() {
  const [branch, setBranch] = useState('ทุกสาขา');
  const [condition, setCondition] = useState('เดือนที่ผ่านมา');

  useTitleContext({ title: 'dashboard', icon: <DashboardOutlined /> });

  const renderContent = () => {
    return (
      <>
        <CashierRetailPerHourPage />
        <CashierRetailPage />
        <MallSalesPage />
        <RetailPage />
        <PromotionPage />
        <MenuPage />
      </>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ background: '#fff', padding: '16px 32px' }}>
        <Row align="middle" gutter={16}>
          <Col>
            <Title level={2} style={{ color: '#2196f3', margin: 0 }}>
              DASHBOARD
            </Title>
          </Col>
          <Col flex="auto" />
          <Col>
            <Space>
              <Text>สาขา:</Text>
              <Select value={branch} onChange={setBranch} style={{ width: 120 }}>
                <Option value="ทุกสาขา">ทุกสาขา</Option>
                <Option value="สาขา 1">สาขา 1</Option>
              </Select>
              <Text>เงื่อนไขแสดงผล:</Text>
              <Select value={condition} onChange={setCondition} style={{ width: 150 }}>
                <Option value="เดือนที่ผ่านมา">เดือนที่ผ่านมา</Option>
                <Option value="ปีนี้">ปีนี้</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Header>
      {/* Content Dashboard */}
      {renderContent()}
    </Layout>
  );
}
