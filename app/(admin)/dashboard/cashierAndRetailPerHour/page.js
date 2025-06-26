'use client';

import React, { useState } from 'react';
import { Typography, Card, Row, Col, Layout } from 'antd';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Line,
  Dot,
} from 'recharts';

const { Content } = Layout;
const { Title } = Typography;

const hourLabels = [
  '07:00-07:59',
  '08:00-08:59',
  '09:00-09:59',
  '10:00-10:59',
  '11:00-11:59',
  '12:00-12:59',
  '13:00-13:59',
  '14:00-14:59',
  '15:00-15:59',
  '16:00-16:59',
  '17:00-17:59',
  '18:00-18:59',
  '19:00-19:59',
  '20:00-20:59',
  '21:00-21:59',
  '22:00-22:59',
  '23:00-23:59',
  '00:00-06:59',
];

// ตัวอย่างข้อมูลใหม่: สมมุติยอดขายแต่ละชั่วโมง (สามารถแก้ไขค่าตามจริงได้)
const data = hourLabels.map((hour, idx) => ({
  hour,
  cashier: [
    500, 1200, 2500, 4000, 6000, 7000, 8000, 9000, 9500, 10000, 8500, 7000, 6000, 4000,
    3000, 2000, 1000, 500,
  ][idx],
  retail: [
    400, 1000, 2000, 3500, 5500, 6500, 7500, 8500, 9000, 9500, 8000, 6500, 5500, 3500,
    2500, 1500, 800, 400,
  ][idx],
}));

export default function CashierAndRetailPerHourPage() {
  const [topN, setTopN] = useState(10);

  return (
    <Content style={{ padding: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <Card>
        <Row>
          <Col>
            <Title level={4} style={{ color: '#2196f3' }}>
              ยอดขายแคชเชียร์ และร้านค้ารายชั่วโมง
            </Title>
          </Col>
        </Row>

        <div style={{ borderBottom: '1px solid #e0e0e0', margin: '16px 0' }} />

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <XAxis dataKey="hour" interval={0} angle={-90} textAnchor="end" height={80} />
            <YAxis tickFormatter={v => v.toLocaleString()} />
            <Tooltip
              cursor={{ fill: '#f5f5f5' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = data.find(d => d.hour === label);
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
                      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
                      <div style={{ color: '#388e3c', fontWeight: 500 }}>
                        แคชเชียร์: {item?.cashier?.toLocaleString()}
                      </div>
                      <div style={{ color: '#b71c1c', fontWeight: 500, marginTop: 8 }}>
                        ร้านค้า: {item?.retail?.toLocaleString()}
                      </div>
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
            <Line
              type="linear"
              dataKey="cashier"
              name="แคชเชียร์"
              stroke="#388e3c"
              strokeWidth={3}
              dot={{ r: 5, fill: '#388e3c', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="linear"
              dataKey="retail"
              name="ร้านค้า"
              stroke="#b71c1c"
              strokeWidth={3}
              dot={{ r: 5, fill: '#b71c1c', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Content>
  );
}
