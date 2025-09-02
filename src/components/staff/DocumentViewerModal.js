// src/components/DocumentViewerModal.js
import React from 'react';
import { Modal } from 'antd';

const DocumentViewerModal = ({ visible, onClose, fileUrl }) => {
  return (
    <Modal
      title="View Document"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <iframe
        src={fileUrl}
        width="100%"
        height="600px"
        style={{ border: 'none' }}
        title="Document Viewer"
      />
    </Modal>
  );
};

export default DocumentViewerModal;
