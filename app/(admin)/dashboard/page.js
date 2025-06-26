'use client';
import React, { useState } from 'react';
import { Layout, Typography, Select, Row, Col, Space } from 'antd';
import { useTitleContext } from '@/components/TitleContext';
import { DashboardOutlined } from '@ant-design/icons';
import CashierAndRetailPage from './cashierAndRetail/page';
import MenuPage from './menu/page';
import RetailPage from './retail/page';
import PromotionPage from './promotion/page';
import MallSalesPage from './mallSales/page';
import CashierAndRetailPerHourPage from './cashierAndRetailPerHour/page';

const { Header, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function DashboardPage() {
  const [branch, setBranch] = useState('ทุกสาขา');
  const [condition, setCondition] = useState('เดือนที่ผ่านมา');

  useTitleContext({ title: 'dashboard', icon: <DashboardOutlined /> });

  const renderContent = () => {
    return (
      <>
        <CashierAndRetailPerHourPage />
        <CashierAndRetailPage />
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
      <Footer style={{ textAlign: 'center', color: '#aaa' }}>
        Copyright©2025 Sabuy Solutions Co., Ltd. Version App. V.1.0.0.1
      </Footer>
    </Layout>
  );
}
