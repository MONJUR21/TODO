import React, { useState } from 'react';

function AddCourseModal({ onClose, onSave }) {
  const [courseName, setCourseName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (courseName.trim()) {
      onSave(courseName);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add New Course</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="course-name">Course Name</label>
            <input
              id="course-name"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g., Data Structures"
              required
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCourseModal;