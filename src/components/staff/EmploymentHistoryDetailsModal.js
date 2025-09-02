// src/components/EmploymentHistoryDetailsModal.js
import React from 'react';
import { Modal, Descriptions } from 'antd';
import dayjs from 'dayjs';

const EmploymentHistoryDetailsModal = ({ visible, onClose, record }) => {
  return (
    <Modal
      title="Employment History Details"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Company">{record.company}</Descriptions.Item>
        <Descriptions.Item label="Job Title">{record.job_title}</Descriptions.Item>
        <Descriptions.Item label="Start Date">{dayjs(record.start_date).format('YYYY-MM-DD')}</Descriptions.Item>
        <Descriptions.Item label="End Date">{record.end_date ? dayjs(record.end_date).format('YYYY-MM-DD') : 'Present'}</Descriptions.Item>
        <Descriptions.Item label="Details">{record.details || '—'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default EmploymentHistoryDetailsModal;