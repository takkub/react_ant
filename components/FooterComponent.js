import React from 'react';
import { Layout } from 'antd';
const { Footer } = Layout;
export default function FooterComponent() {
  const currentYear = new Date().getFullYear();

  return (
    <Footer style={{ textAlign: 'center', color: '#aaa' }}>
      Copyright©{currentYear} Sabuy Solutions Co., Ltd. Version App. V.1.0.0.1
    </Footer>
  );
}
