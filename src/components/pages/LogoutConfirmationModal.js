// src/components/LogoutConfirmationModal.js
import React from 'react';
import './LogoutConfirmationModal.css';

const LogoutConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="logout-modal">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn">Yes, Log Out</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
