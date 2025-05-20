import React, { useState } from 'react';
import FileItem from './FileItem';
import UploadFileModal from './UploadFileModal';
import ConfirmationModal from './ConfirmationModal';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';

function CourseFolder({ course, onUpdate, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const addFile = (file) => {
    const newFile = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      content: file.content
    };
    onUpdate({
      ...course,
      files: [...course.files, newFile]
    });
  };

  const deleteFile = (fileId) => {
    onUpdate({
      ...course,
      files: course.files.filter(file => file.id !== fileId)
    });
  };

  return (
    <div className="course-folder">
      <div className="course-header">
        <button 
          className="toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
        </button>
        <h4>{course.name}</h4>
        <div className="course-actions">
          <button 
            className="icon-btn"
            onClick={() => setShowUploadModal(true)}
            aria-label="Upload file"
          >
            <FiPlus />
          </button>
          <button 
            className="icon-btn delete-btn"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Delete course"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="files-container">
          {course.files.length === 0 ? (
            <p className="empty-message">No files yet. Click the + button to add some.</p>
          ) : (
            course.files.map(file => (
              <FileItem 
                key={file.id}
                file={file}
                onDelete={deleteFile}
              />
            ))
          )}
        </div>
      )}

      {showUploadModal && (
        <UploadFileModal
          onClose={() => setShowUploadModal(false)}
          onSave={addFile}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          message={`Are you sure you want to delete ${course.name} and all its files?`}
          onConfirm={() => {
            onDelete(course.id);
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default CourseFolder;