import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import './EmployeePaymentDetail.css';

const EmployeePaymentDetailModal = ({ visible, onFinish, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [paymentMode, setPaymentMode] = React.useState(initialValues?.payment_mode || '');
 
  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
      setPaymentMode(initialValues.payment_mode || '');
    }
  }, [form, initialValues, visible]);
 
  const handlePaymentModeChange = (value) => {
    setPaymentMode(value);
    if (value === 'Bank Transfer') {
      form.setFieldsValue({
        mobile_money_provider: undefined,
        wallet_number: undefined
      });
    } else if (value === 'Mobile Money') {
      form.setFieldsValue({
        bank_name: undefined,
        account_number: undefined
      });
    }
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        onFinish(values);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };
 
  return (
    <Modal
      title={initialValues?.employee_id ? `Edit Payment Details - ${initialValues.employee_id}` : "Add Payment Details"}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={handleSubmit}>
          Save
        </Button>
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        {/* <Form.Item
          label="Employee ID"
          name="employee_id"
          rules={[{ required: true, message: 'Please enter Employee ID' }]}
        >
          <Input />
        </Form.Item> */}
       
        <Form.Item
          label="Payment Mode"
          name="payment_mode"
          rules={[{ required: true, message: 'Please select payment mode' }]}
        >
          <Select onChange={handlePaymentModeChange}>
            <Select.Option value="Bank Transfer">Bank Transfer</Select.Option>
            <Select.Option value="Mobile Money">Mobile Money</Select.Option>
          </Select>
        </Form.Item>
       
        {paymentMode === 'Bank Transfer' && (
          <>
            <Form.Item
              label="Bank Name"
              name="bank_name"
              rules={[{ required: true, message: 'Please enter bank name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Account Number"
              name="account_number"
              rules={[{ required: true, message: 'Please enter account number' }]}
            >
              <Input />
            </Form.Item>
          </>
        )}
       
        {paymentMode === 'Mobile Money' && (
          <>
            <Form.Item
              label="Mobile Money Provider"
              name="mobile_money_provider"
              rules={[{ required: true, message: 'Please select provider' }]}
            >
              <Select>
                <Select.Option value="MTN MOMO">MTN MOMO</Select.Option>
                <Select.Option value="Telecel Cash">Telecel Cash</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Wallet Number"
              name="wallet_number"
              rules={[{ required: true, message: 'Please enter wallet number' }]}
            >
              <Input />
            </Form.Item>
          </>
        )}
       
        <Form.Item label="Additional Info" name="additional_info">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeePaymentDetailModal;