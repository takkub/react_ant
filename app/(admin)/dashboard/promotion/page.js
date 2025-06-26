'use client';

import React, { useState } from 'react';
import { Typography, Select, InputNumber, Card, Row, Col, Layout } from 'antd';
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Bar,
} from 'recharts';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const data = [
  {
    id: '0000024720427',
    name: 'ข้าวมันไก่สิงคโปร',
    totalValue: 60457,
    cashCard: 35257,
    payment: 20125,
    delivery: 5075,
    walkIn: 43500,
    kiosk: 16957,
  },
  {
    id: '0000024720428',
    name: 'skyluck',
    totalValue: 50000,
    cashCard: 25000,
    payment: 15000,
    delivery: 3000,
    walkIn: 38000,
    kiosk: 12000,
  },
  {
    id: '0000024720429',
    name: 'ก๋วยเตี๋ยวเรือ',
    totalValue: 30000,
    cashCard: 18000,
    payment: 12000,
    delivery: 2000,
    walkIn: 25000,
    kiosk: 8000,
  },
  {
    id: '0000024720430',
    name: 'ข้าวขาหมูจุฬา',
    totalValue: 20000,
    cashCard: 12000,
    payment: 8000,
    delivery: 1500,
    walkIn: 15000,
    kiosk: 5000,
  },
  {
    id: '0000024720431',
    name: 'ข้าวหน้าเป็ด',
    totalValue: 10000,
    cashCard: 6000,
    payment: 4000,
    delivery: 800,
    walkIn: 8000,
    kiosk: 2000,
  },
  {
    id: '0000024720432',
    name: 'จตุพรของหวาน',
    totalValue: 15000,
    cashCard: 9000,
    payment: 6000,
    delivery: 1000,
    walkIn: 12000,
    kiosk: 4000,
  },
  {
    id: '0000024720433',
    name: 'ตามสั่ง',
    totalValue: 25000,
    cashCard: 15000,
    payment: 10000,
    delivery: 2000,
    walkIn: 20000,
    kiosk: 7000,
  },
  {
    id: '0000024720434',
    name: 'ข้าวผัดกุ้ง',
    totalValue: 35000,
    cashCard: 21000,
    payment: 14000,
    delivery: 2500,
    walkIn: 28000,
    kiosk: 9000,
  },
  {
    id: '0000024720435',
    name: 'ข้าวหมูกรอบ',
    totalValue: 28000,
    cashCard: 16800,
    payment: 11200,
    delivery: 1800,
    walkIn: 22400,
    kiosk: 7200,
  },
  {
    id: '0000024720436',
    name: 'ข้าวหมูแดง',
    totalValue: 32000,
    cashCard: 19200,
    payment: 12800,
    delivery: 2200,
    walkIn: 25600,
    kiosk: 8200,
  },
];

export default function PromotionPage() {
  const [pos, setPos] = useState('เคาน์เตอร์');
  const [topN, setTopN] = useState(10);

  return (
    <Content style={{ padding: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <Card>
        <Row align="middle" gutter={16}>
          <Col>
            <Title level={4} style={{ color: '#2196f3' }}>
              ลำดับโปรโมชั่นขายดี
            </Title>
          </Col>
          <Col flex="auto" />
          <Row align="middle" gutter={16}>
            <Col>
              <Text>จุดขาย:</Text>
            </Col>
            <Col>
              <Select value={pos} onChange={setPos} style={{ width: 120 }}>
                <Option value="เคาน์เตอร์">เคาน์เตอร์</Option>
                <Option value="ออนไลน์">ออนไลน์</Option>
              </Select>
            </Col>
            <Col>
              <Text>แสดงลำดับโปรโมชั่น</Text>
            </Col>
            <Col>
              {/* max 10 */}
              <InputNumber
                min={1}
                max={data.length}
                value={topN}
                onChange={setTopN}
                style={{ width: 60 }}
              />
            </Col>
            <Col>
              <Text>อันดับ</Text>
            </Col>
          </Row>
        </Row>

        <div style={{ borderBottom: '1px solid #e0e0e0', margin: '16px 0' }} />

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data.slice(0, topN)}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          >
            <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={80} />
            <YAxis tickFormatter={v => v.toLocaleString()} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = data.find(d => d.name === label);
                  if (item) {
                    return (
                      <div
                        style={{
                          backgroundColor: 'white',
                          padding: '10px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      >
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                          {item.name}
                        </p>
                        <p style={{ margin: '0 0 5px 0' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                              gap: '5px',
                            }}
                          >
                            <span>Cashcard</span>
                            {item.cashCard.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </p>
                        <p style={{ margin: '0 0 5px 0' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                              gap: '5px',
                            }}
                          >
                            <span>Payment</span>
                            {item.payment.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </p>
                        <p style={{ margin: '0 0 5px 0' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                              gap: '5px',
                            }}
                          >
                            <span>Delivery</span>
                            {item.delivery.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </p>
                        <hr style={{ margin: '5px 0' }} />
                        <p style={{ margin: '0 0 5px 0' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                              gap: '5px',
                            }}
                          >
                            <span>Walk In</span>
                            {item.walkIn.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </p>
                        <p style={{ margin: '0 0 5px 0' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                              gap: '5px',
                            }}
                          >
                            <span>Kiosk</span>
                            {item.kiosk.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </p>
                      </div>
                    );
                  }
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" align="right" />
            <Bar
              dataKey="totalValue"
              name="โปรโมชั่น"
              fill="#17c3c7 "
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="totalValue"
                position="top"
                formatter={v => v.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Content>
  );
}
