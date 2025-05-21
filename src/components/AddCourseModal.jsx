import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

function AddCourseModal({ onClose, onSave }) {
  const [courseName, setCourseName] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (courseName.trim()) {
      onSave(courseName);
      onClose();
    }
  };

  const modalElement = (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Course</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter course name"
            autoFocus
            required
          />
        </form>
        <div className="modal-footer">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" onClick={handleSubmit}>Add Course</button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalElement, document.getElementById('modal-root'));
}

AddCourseModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default AddCourseModal;
