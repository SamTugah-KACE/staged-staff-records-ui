// EmergencyContactForm.js
import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import './EmergencyContact.css';

const EmergencyContactForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({...initialValues});
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const formatted = {
      ...values,
     
    };


    onFinish(formatted);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} className="custom-form">
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter name' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Relation" name="relation" rules={[{ required: true, message: 'Please enter relation' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Phone" name="emergency_phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Address" name="emergency_address">
        <Input />
      </Form.Item>
      <Form.Item label="Details" name="details">
        <Input.TextArea />
      </Form.Item>
      <div className="form-actions">
        <Button type="primary" htmlType="submit" className="save-button">Save</Button>
        <Button onClick={onCancel} className="cancel-button">Cancel</Button>
      </div>
    </Form>
  );
};

export default EmergencyContactForm;