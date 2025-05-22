'use client';
import { useTitleContext } from '@/components/TitleContext';
import { CloseCircleOutlined, DeleteOutlined, DownloadOutlined, PlusCircleOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select, Table, TimePicker } from "antd";
import { useState } from 'react';

export default function TestPage() {
    useTitleContext({ title: 'Branch', icon: <UserOutlined /> });

    const [form] = Form.useForm();
    const [selectionType] = useState('checkbox');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };

    const columns = [
        {
            title: 'Branch Code',
            dataIndex: 'branch_id',
        },
        {
            title: 'Branch Name',
            dataIndex: 'branch_name',
        },
        {
            title: 'Branch Detail',
            dataIndex: 'branch_detail',
        },
        {
            title: 'Manager',
            dataIndex: 'manager',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Update Date',
            dataIndex: 'update_date',
        },
    ];

    const data = [
        {
            branch_id: '1',
            branch_name: 'Central Plaza',
            branch_detail: 'Main shopping center branch',
            manager: 'Somsak Jaroensuk',
            phone: '02-123-4567',
            status: 'active',
            update_date: '2025-05-20',
        },
        {
            branch_id: '2',
            branch_name: 'Bangna Outlet',
            branch_detail: 'Outlet store near Bangna intersection',
            manager: 'Chalita Saengsiri',
            phone: '02-888-9999',
            status: 'inactive',
            update_date: '2025-05-18',
        },
        {
            branch_id: '3',
            branch_name: 'Chiang Mai Branch',
            branch_detail: 'Northern regional service branch',
            manager: 'Nattapong Wongdee',
            phone: '053-222-444',
            status: 'active',
            update_date: '2025-05-10',
        },
        {
            branch_id: '4',
            branch_name: 'Phuket Store',
            branch_detail: 'Tourist-focused store near Patong',
            manager: 'Anchana Thongdee',
            phone: '076-789-000',
            status: 'active',
            update_date: '2025-05-21',
        },

    ];

    const handleAddClick = () => {
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        form.resetFields();
    };

    const handleSubmit = (values) => {
        console.log('Form values:', values);
    };

    const onSearch = (value) => {
        console.log(value);
    }
    return (
        <Card>
            {isFormVisible ? (
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 12 }}

                >
                    <Card title="ข้อมูลสาขา" style={{ marginBottom: 24 }}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="ประเภทสาขา" name="branchType">
                                    <Radio.Group>
                                        <Radio value="branch">สาขา</Radio>
                                        <Radio value="head_office">สำนักงานใหญ่</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label="รหัสสาขา" name="branchCode" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="ชื่อภาษาไทย" name="thaiName" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="ชื่อภาษาอังกฤษ" name="engName" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="วันที่เปิด" name="openDate">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item label="วันที่ปิด" name="closeDate">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="ภูมิภาค" name="region">
                                    <Select placeholder="เลือกภูมิภาค">
                                        <Select.Option value="north">ภาคเหนือ</Select.Option>
                                        <Select.Option value="central">ภาคกลาง</Select.Option>
                                        <Select.Option value="south">ภาคใต้</Select.Option>
                                        <Select.Option value="east">ภาคตะวันออก</Select.Option>
                                        <Select.Option value="west">ภาคตะวันตก</Select.Option>
                                        <Select.Option value="northeast">ภาคอีสาน</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="สถานะ" name="status">
                                    <Select placeholder="เลือกสถานะ">
                                        <Select.Option value="active">เปิดใช้งาน</Select.Option>
                                        <Select.Option value="inactive">ปิดใช้งาน</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="รหัสที่ออกโดยสรรพากร" name="issueCode" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="เลขที่ผู้เสียภาษีอากร" name="taxNumber" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="รายละเอียด" name="description">
                                    <Input.TextArea rows={3} />
                                </Form.Item>

                                <Form.Item label="ผู้จัดการสาขา" name="manager">
                                    <Input />
                                </Form.Item>

                                <Form.Item label="เบอร์โทรศัพท์" name="phone">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="การตั้งค่าสาขา" style={{ marginBottom: 24 }}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="การปิดระบบสาขาสิ้นวัน" name="branchCloseSystem">
                                    <Radio.Group>
                                        <Radio value="manual">ด้วยตัวเอง</Radio>
                                        <Radio value="auto">อัตโนมัติ</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label="การใช้งานข้ามสาขา" name="crossBranchUsage">
                                    <Radio.Group>
                                        <Radio value="no">ไม่ข้ามสาขา</Radio>
                                        <Radio value="yes">ข้ามสาขา</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label="เวลาปิดระบบสิ้นวัน" name="systemCloseTime">
                                    <TimePicker style={{ width: '100%' }} format="HH:mm" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="การจดภาษี" name="taxRegistration">
                                    <Checkbox.Group>
                                        <Row>
                                            <Col span={24}>
                                                <Checkbox value="cashier">แคชเชียร์</Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="store">ร้านค้า</Checkbox>
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="กำหนด Header ในการพิมพิ์ใบกำกับภาษี">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="ชื่อบริษัท" name="companyName" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="ชื่อหัวสลิป" name="slipHeader" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="ข้อความสลิปภาษาไทย" name="slipTextThai" rules={[{ required: true }]}>
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="ที่อยู่สำหรับออกใบกำกับภาษี" name="invoiceAddress" rules={[{ required: true }]}>
                                    <Input.TextArea rows={4} />
                                </Form.Item>

                                <Form.Item label="ข้อความสลิปภาษาอังกฤษ" name="slipTextEng" rules={[{ required: true }]}>
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                            Save
                        </Button>
                        <Button type="primary" danger style={{ marginLeft: 8 }} onClick={handleCancel} icon={<CloseCircleOutlined />}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        <div>
                            <Button type="primary" onClick={handleAddClick} icon={<PlusCircleOutlined />}>Add</Button>
                            <Button type="primary" danger style={{ marginLeft: 8 }} icon={<DeleteOutlined />}>Delete</Button>
                        </div>
                        <div style={{display: "flex", gap: 8}}>
                            <Input.Search placeholder="ค้นหา" onSearch={onSearch} style={{ width: 200 }} />
                            <Select placeholder="เลือกสถานะ">
                                <Select.Option value="active">เปิดใช้งาน</Select.Option>
                                <Select.Option value="inactive">ปิดใช้งาน</Select.Option>
                            </Select>
                            <Button icon={<DownloadOutlined />}>Download</Button>
                        </div>
                    </div>
                    <Table
                        rowSelection={{ type: selectionType, ...rowSelection }}
                        columns={columns}
                        dataSource={data}
                    />
                </>
            )}
        </Card>
    );
}
