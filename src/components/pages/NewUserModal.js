import React, { useEffect, useRef } from 'react';
import MultiStepForm from './MultiStepForm';
import './NewUserModal.css';
import request from '../request';
import { toast } from 'react-toastify'; 

const NewUserModal = ({ organizationId, userId, onClose, onUserAdded  }) => {
  const modalRef = useRef();

  useEffect(() => {
    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select'
    );
    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];
    firstEl?.focus();

    const trap = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [onClose]);
  
  
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="newuser-modal-content" onClick={(e) => e.stopPropagation()}>
//         <h2>New User Registration</h2>
//         <MultiStepForm />
//         <button className="modal-close-btn" onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

  // Called when MultiStepForm calls onSubmitSuccess
  const handleSuccess = (payload) => {
   request.post('/users/create', payload)
    .then(() => {
      onUserAdded();  // dashboard toast + data refresh
      onClose();
    })
     .catch(err => toast.error('Create failed'));
  };

return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div
        className="newuser-modal-content"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>New User Registration</h2>

        <MultiStepForm
          organizationId={organizationId}
          userId={userId}
          onSubmitSuccess={onUserAdded}
        />

        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NewUserModal;
