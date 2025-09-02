// src/components/FileModal.js
import React from 'react';
import './FileModal.css';

const FileModal = ({ filePath, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>X</button>
        <div className="file-viewer">
          {/* For PDF/Excel etc., you may adjust the tag as necessary */}
          <iframe src={filePath} title="File Content" width="100%" height="500px" />
        </div>
      </div>
    </div>
  );
};

export default FileModal;
