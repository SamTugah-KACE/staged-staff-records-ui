import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Button, Select, Row, Col, InputNumber } from 'antd';
import moment from 'moment';
import './SalaryPayment.css';

const SalaryPaymentForm = ({ initialValues, onFinish, onCancel, ranks, users }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        // Convert date string to moment object if it exists
        const formattedValues = { ...initialValues };
        if (formattedValues.payment_date) {
            formattedValues.payment_date = moment(formattedValues.payment_date);
        }
        form.setFieldsValue(formattedValues);
    }, [initialValues, form]);

    const handleFinish = (values) => {
        const formattedValues = {
            ...values,
            payment_date: values.payment_date?.format('YYYY-MM-DD'),
            amount: Number(values.amount),
        };
        onFinish(formattedValues);
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish} className="custom-form">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item 
                        label="Employee ID" 
                        name="employee_id" 
                        rules={[{ required: true, message: 'Please enter employee ID' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Rank"
                        name="rank_id"
                        rules={[{ required: true, message: 'Please select rank' }]}
                    >
                        <Select>
                            {ranks.map((rank) => (
                                <Select.Option key={rank.id} value={rank.id}>
                                    {rank.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        label="Currency"
                        name="currency"
                        rules={[{ required: true, message: 'Please select currency' }]}
                        initialValue="USD"
                    >
                        <Select>
                            <Select.Option value="USD">USD</Select.Option>
                            <Select.Option value="EUR">EUR</Select.Option>
                            <Select.Option value="GBP">GBP</Select.Option>
                            <Select.Option value="GHS">GHS</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item 
                        label="Amount" 
                        name="amount" 
                        rules={[{ required: true, message: 'Please enter amount' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            precision={2}
                        />
                    </Form.Item>
                </Col>
            </Row>
            
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item 
                        label="Payment Date" 
                        name="payment_date" 
                        rules={[{ required: true, message: 'Please select payment date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        label="Payment Method" 
                        name="payment_method" 
                        rules={[{ required: true, message: 'Please select payment method' }]}
                    >
                        <Select>
                            <Select.Option value="Bank Transfer">Bank Transfer</Select.Option>
                            <Select.Option value="MTN MOMO">MTN MOMO</Select.Option>
                            <Select.Option value="Telecel Cash">Telecel Cash</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item 
                        label="Transaction ID" 
                        name="transaction_id" 
                        rules={[{ required: true, message: 'Please enter transaction ID' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        label="Status" 
                        name="status" 
                        rules={[{ required: true, message: 'Please select status' }]}
                        initialValue="Pending"
                    >
                        <Select>
                            <Select.Option value="Success">Success</Select.Option>
                            <Select.Option value="Pending">Pending</Select.Option>
                            <Select.Option value="Failed">Failed</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            
            <Form.Item
                label="Approved By"
                name="approved_by"
                rules={[{ required: false }]}
            >
                <Select allowClear>
                    {users.map((user) => (
                        <Select.Option key={user.id} value={user.id}>
                            {user.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <div className="form-actions">
                <Button type="primary" htmlType="submit" className="save-button">
                    Save
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={onCancel} className="cancel-button">
                    Cancel
                </Button>
            </div>
        </Form>
    );
};

export default SalaryPaymentForm;