import React, { useState } from 'react';
import BaseModal from './BaseModal';

function AddSemesterModal({ onClose, onSave }) {
  const [semesterName, setSemesterName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!semesterName.trim()) {
      setError('Please enter a semester name');
      return;
    }
    onSave(semesterName.trim());
    onClose();
  };

  return (
    <BaseModal
      title="Add New Semester"
      onClose={onClose}
      footerContent={
        <>
          <button 
            type="button" 
            className="btn secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn primary"
            form="add-semester-form"
          >
            Add Semester
          </button>
        </>
      }
    >
      <form id="add-semester-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="semester-name">Semester Name</label>
          <input
            id="semester-name"
            type="text"
            value={semesterName}
            onChange={(e) => {
              setSemesterName(e.target.value);
              setError('');
            }}
            placeholder="e.g., Fall 2023 or 5th Semester"
            className={error ? 'error' : ''}
            autoFocus
          />
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </BaseModal>
  );
}

export default AddSemesterModal;