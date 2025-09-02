import React from 'react';
import { Modal } from 'antd';
import SalaryPaymentForm from './SalaryPaymentForm';
import './SalaryPayment.css';


const SalaryPaymentModal = ({ 
  visible, 
  initialValues, 
  onCancel, 
  onFinish, 
  ranks, 
  users 
}) => {
  return (
    <Modal
      title="Salary Payment Details"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <SalaryPaymentForm
        initialValues={initialValues}
        onFinish={onFinish}
        onCancel={onCancel}
        ranks={ranks}
        users={users}
      />
    </Modal>
  );
};

export default SalaryPaymentModal;