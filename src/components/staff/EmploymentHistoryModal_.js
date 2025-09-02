import React from 'react';
import { Modal } from 'antd';
import EmploymentHistoryForm from './EmploymentHistoryForm';

const EmploymentHistoryModal = ({ 
  visible, 
  initialValues, 
  onFinish, 
  onCancel 
}) => {
  return (
    <Modal
      title={initialValues?.id ? "Edit Employment Record" : "Add Employment Record"}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <EmploymentHistoryForm
        initialValues={initialValues}
        // onFinish={onFinish}
        onFinish={(values, files) => onFinish(values, files)}
        onCancel={onCancel}
      />
    </Modal>
  );
};

export default EmploymentHistoryModal;