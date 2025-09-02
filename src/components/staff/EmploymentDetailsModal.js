// src/components/staff/EmploymentDetailsModal.js
import React from 'react';
import { Modal } from 'antd';
import EmploymentDetailsForm from './EmploymentDetailsForm';
import './EmploymentDetailsSection.css'; // Add this import

const EmploymentDetailsModal = ({ visible, initialValues, onFinish, onCancel }) => {
  return (
    <Modal
      title="Edit Employment Details"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
      className="employment-details-modal" // Add this className
    >
      <EmploymentDetailsForm
        initialValues={initialValues}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </Modal>
  );
};

export default EmploymentDetailsModal;