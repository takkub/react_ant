'use client';

import { Form, Input, Button, Card, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const LoginContent = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const onFinish = async (values) => {
    try {
      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        message.error('Login failed. Please check your credentials.');
      } else {
        message.success('Login successful!');
        router.push('/dashboard');
      }
    } catch (error) {
      message.error('An error occurred during login.');
      console.error('Login error:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px'
        }}
        title={
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            Admin Login
          </div>
        }
      >
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              style={{ width: '100%' }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default function LoginPage() {
  return (
    <App>
      <LoginContent />
    </App>
  );
}