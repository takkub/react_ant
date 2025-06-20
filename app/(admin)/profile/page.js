'use client';
import { useTitleContext } from '@/components/TitleContext';
import { SaveOutlined, StepBackwardOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Form, Input, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
    const router = useRouter();
    const [form] = Form.useForm();
    useTitleContext({ title: 'My Profile', icon: <UserOutlined /> });
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
    };

    const user = {
        user_id: "1234",
        name_th: "สมศรี รีบไปหวัน",
        name_en: "somsri rebpawan",
        status: "active",
        password: "1234567",
        confirm_password: "12345657",
        region: "",
        branch: ""
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                ...user
            })
        }
    }, [form, user])

    const onFinish = values => {
        console.log(values);
    };

    return (
        <Card title="My Profile" variant="borderless">
            <Form
                {...layout}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                // style={{ maxWidth: 600 }}
                labelWrap
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item name="user_id" label="User ID" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item name="name_th" label="Name TH" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="region" label="Region" rules={[{ required: true }]}>
                            <Select placeholder="Select Region" >
                                <Select.Option value="sample">Sample</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="status" label="Status">
                            <Select
                                placeholder="Select Status"
                                allowClear
                            >
                                <Option value="active">ใช้งาน</Option>
                                <Option value="inactive">ไม่ใช้งาน</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="confirm_password" label="Confirm Password" rules={[{ required: true }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item name="name_en" label="Name EN" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="branch" label="Branch" rules={[{ required: true }]}>
                            <Select placeholder="Select Branch" >
                                <Select.Option value="sample">Sample</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider />
                <Form.Item style={{ display: "flex", justifyContent: "center", padding: 0, margin: 0 }}>
                    <Space >
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                            Update
                        </Button>
                        <Button onClick={() => router.back()} icon={<StepBackwardOutlined />}>
                            Back
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}