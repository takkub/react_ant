'use client';
import React, { useState } from "react";
import { useTitleContext } from '@/components/TitleContext';
import { UserOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Drawer, Form, Input, Modal, Radio, Select, Space, Spin, Switch, Tabs, message } from "antd";

export default function TestPage() {
    useTitleContext({ title: 'User', icon: <UserOutlined /> });
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [disabled, setDisabled] = useState(true);
    const [open, setOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onChangeDatePicker = (date, dateString) => {
        console.log(date, dateString);
    };
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const items = [
        {
            key: '1',
            label: 'Tab 1',
            children: 'Content of Tab Pane 1',
        },
        {
            key: '2',
            label: 'Tab 2',
            children: 'Content of Tab Pane 2',
        },
        {
            key: '3',
            label: 'Tab 3',
            children: 'Content of Tab Pane 3',
        },
    ];
    const onChange = key => {
        console.log(key);
    };
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'This is a success message',
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'This is an error message',
        });
    };
    const warning = () => {
        messageApi.open({
            type: 'warning',
            content: 'This is a warning message',
        });
    };
    const onReset = () => {
        form.resetFields();
    };
    return (
        <div>
            <Card>
                <div>
                    <h1>Test UI</h1>
                    <p>Welcome to test ui</p>
                </div>
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item name="note" label="Note" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select a option and change input text above"
                            // onChange={onGenderChange}
                            allowClear
                        >
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                            <Option value="other">other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="date" label="Date">
                        <DatePicker onChange={onChangeDatePicker} />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                        <Radio defaultChecked={false} >
                            Disabled
                        </Radio>
                        <Radio defaultChecked >
                            Disabled
                        </Radio>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

                <Button type="primary" onClick={showDrawer}>
                    Open
                </Button>
                <Drawer
                    title="Basic Drawer"
                    closable={{ 'aria-label': 'Close Button' }}
                    onClose={onClose}
                    open={open}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Drawer>

                <Button type="primary" onClick={showModal}>
                    Open Modal
                </Button>
                <Modal
                    title="Basic Modal"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
                {contextHolder}
                <Space>
                    <Button onClick={success}>Success</Button>
                    <Button onClick={error}>Error</Button>
                    <Button onClick={warning}>Warning</Button>
                </Space>
                <Spin />
            </Card>

        </div>
    );
}