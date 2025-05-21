import React from 'react';
import BaseModal from './BaseModal';

function ConfirmationModal({ 
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  onConfirm,
  onCancel,
  danger = false
}) {
  return (
    <BaseModal
      title={title}
      onClose={onCancel}
      footerContent={
        <>
          <button 
            className="btn secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className={`btn ${danger ? 'danger' : 'primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </BaseModal>
  );
}

export default ConfirmationModal;
