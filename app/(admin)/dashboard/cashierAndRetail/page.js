'use client';

import React, { useState } from 'react';
import { Typography, Card, Row, Col, Layout } from 'antd';
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
const { Title } = Typography;

const data = [
  {
    branch: '2097',
    name: 'สาขาเกษตรฯ',
    cashier: 70000,
    retail: 53257,
    cashierDetail: {
      Cashcard: 35257,
      Payment: 17500,
      Delivery: 2500,
      WalkIn: 43500,
      Kios: 9757,
    },
    retailDetail: {},
  },
  {
    branch: '2098',
    name: 'ลาดพร้าว',
    cashier: 68450,
    retail: 77732,
    cashierDetail: {
      Cashcard: 35257,
      Payment: 17500,
      Delivery: 2500,
      WalkIn: 43500,
      Kios: 9757,
    },
    retailDetail: {},
  },
  {
    branch: '2099',
    name: 'เชียงใหม่',
    cashier: 15250,
    retail: 15300,
    cashierDetail: {},
    retailDetail: {},
  },
  {
    branch: '2100',
    name: 'ประดำ',
    cashier: 17520,
    retail: 15230,
    cashierDetail: {},
    retailDetail: {},
  },
  {
    branch: '2101',
    name: 'จามวงศ์วาน',
    cashier: 40153,
    retail: 15230,
    cashierDetail: {
      Cashier: 17500,
      Kios: 35257,
    },
    retailDetail: {},
  },
  {
    branch: '2102',
    name: 'หนองหาน',
    cashier: 12017,
    retail: 9937,
    cashierDetail: {},
    retailDetail: {},
  },
  {
    branch: '2103',
    name: 'สมุทรสาคร',
    cashier: 12017,
    retail: 9937,
    cashierDetail: {},
    retailDetail: {},
  },
  {
    branch: '2104',
    name: 'รัชดา',
    cashier: 12017,
    retail: 9937,
    cashierDetail: {},
    retailDetail: {},
  },
];

export default function CashierAndRetailPage() {
  const [topN, setTopN] = useState(10);

  return (
    <Content style={{ padding: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <Card>
        <Row>
          <Col>
            <Title level={4} style={{ color: '#2196f3' }}>
              ยอดขายแคชเชียร์ และร้านค้า
            </Title>
          </Col>
        </Row>

        <div style={{ borderBottom: '1px solid #e0e0e0', margin: '16px 0' }} />

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data.slice(0, topN)}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            barGap={8}
          >
            <XAxis
              dataKey="branch"
              tickFormatter={(branch, idx) => `${branch}\n${data[idx]?.name || ''}`}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis tickFormatter={v => v.toLocaleString()} />
            <Tooltip
              cursor={{ fill: '#f5f5f5' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = data.find(d => d.branch === label);
                  return (
                    <div
                      style={{
                        backgroundColor: 'white',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        minWidth: 180,
                      }}
                    >
                      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                        {label} {item?.name}
                      </p>
                      <div style={{ color: '#388e3c', fontWeight: 500 }}>
                        แคชเชียร์: {item?.cashier?.toLocaleString()}
                      </div>
                      {item?.cashierDetail &&
                        Object.keys(item.cashierDetail).length > 0 && (
                          <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13 }}>
                            {Object.entries(item.cashierDetail).map(([k, v]) => (
                              <li key={k}>
                                {k}: {v.toLocaleString()}
                              </li>
                            ))}
                          </ul>
                        )}
                      <div style={{ color: '#b71c1c', fontWeight: 500, marginTop: 8 }}>
                        ร้านค้า: {item?.retail?.toLocaleString()}
                      </div>
                      {item?.retailDetail &&
                        Object.keys(item.retailDetail).length > 0 && (
                          <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13 }}>
                            {Object.entries(item.retailDetail).map(([k, v]) => (
                              <li key={k}>
                                {k}: {v.toLocaleString()}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="rect"
              payload={[
                { value: 'แคชเชียร์', type: 'rect', id: 'cashier', color: '#388e3c' },
                { value: 'ร้านค้า', type: 'rect', id: 'retail', color: '#b71c1c' },
              ]}
            />
            <Bar dataKey="cashier" name="แคชเชียร์" fill="#388e3c" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="cashier"
                position="top"
                formatter={v => v.toLocaleString()}
              />
            </Bar>
            <Bar dataKey="retail" name="ร้านค้า" fill="#b71c1c" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="retail"
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
