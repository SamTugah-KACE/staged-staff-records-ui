// ActionModal.js
import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './ActionModal.css';

const modalRoot = document.getElementById('modal-root');

const ActionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type,        // 'Approved' or 'Rejected'
  defaultComments = '' 
}) => {
  const elRef = useRef(document.createElement('div'));
  const [comments, setComments] = useState(defaultComments);

  useEffect(() => {
    const el = elRef.current;
    modalRoot.appendChild(el);
    return () => modalRoot.removeChild(el);
  }, []);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({ status: type, comments: type === 'Rejected' ? comments : undefined });
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{type === 'Approved' ? 'Confirm Approval' : 'Confirm Rejection'}</h3>
        {type === 'Rejected' && (
          <textarea
            className="action-textarea"
            placeholder="Enter comments"
            value={comments}
            onChange={e => setComments(e.target.value)}
          />
        )}
        <div className="action-buttons">
          <button onClick={handleConfirm} className="btn-confirm">
            {type === 'Approved' ? 'Yes, Approve' : 'Yes, Reject'}
          </button>
          <button onClick={onClose} className="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, elRef.current);
};

export default ActionModal;
