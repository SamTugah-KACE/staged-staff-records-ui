// src/components/shared/Modal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

const Modal = ({ title, onClose, children }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="modal-overlay"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
