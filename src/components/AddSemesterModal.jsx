import React, { useState } from 'react';

function AddSemesterModal({ onClose, onSave }) {
  const [semesterName, setSemesterName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (semesterName.trim()) {
      onSave(semesterName);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add New Semester</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="semester-name">Semester Name</label>
            <input
              id="semester-name"
              type="text"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              placeholder="e.g., 5th Semester"
              required
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Add Semester
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSemesterModal;