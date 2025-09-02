// EmergencyContactModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import './EmergencyContact.css';

const EmergencyContactModal = ({ open, initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: initialValues.name || '',
        relation: initialValues.relation || '',
        emergency_phone: initialValues.emergency_phone || '',
        emergency_address: initialValues.emergency_address || '',
        details: initialValues.details || ''

      });
    } 
    // else {
    //   form.resetFields();
    // }
  }, [open, initialValues, form]);

  const handleSubmit = (values) => {
    const contacts ={
      ...values,
      id: initialValues?.id || '',
    }
    onFinish(contacts);
    form.resetFields();
  };

  return (
    <Modal
      title={initialValues?.id ? "Edit Emergency Contact" : "Add Emergency Contact"}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose={true}
      className="custom-modal"
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        className="custom-form"
        // initialValues={initialValues}
      >
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
          <Input.TextArea rows={4} />
        </Form.Item>
        <div className="form-actions">
          <Button type="primary" htmlType="submit" className="save-button">Save</Button>
          <Button onClick={onCancel} className="cancel-button" style={{ marginLeft: 8 }}>Cancel</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EmergencyContactModal;