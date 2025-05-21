import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import FileItem from './FileItem';
import UploadFileModal from './UploadFileModal';
import ConfirmationModal from './ConfirmationModal';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronRight, FiEdit, FiSearch } from 'react-icons/fi';

function CourseFolder({ course, onUpdate, onDelete, isExpanded: propIsExpanded, onToggleExpand }) {
  const [isExpanded, setIsExpanded] = useState(propIsExpanded);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(course.name);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with parent's expanded state
  useEffect(() => {
    setIsExpanded(propIsExpanded);
  }, [propIsExpanded]);

  // Sort files by creation time (newest first) and filter by search query
  const sortedAndFilteredFiles = useMemo(() => {
    return [...course.files]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [course.files, searchQuery]);

  const addFile = (file) => {
    try {
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        content: file.content,
        createdAt: new Date().toISOString()
      };
      onUpdate({
        ...course,
        files: [...course.files, newFile]
      });
      
      // Ensure the course stays expanded after adding a file
      if (!isExpanded) {
        setIsExpanded(true);
        if (onToggleExpand) onToggleExpand();
      }
      
      // Clear search query when adding a new file
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to add file:', error);
    }
  };

  const deleteFile = (fileId) => {
    onUpdate({
      ...course,
      files: course.files.filter(file => file.id !== fileId)
    });
  };

  const handleUpdateCourseName = () => {
    if (editedName.trim()) {
      onUpdate({
        ...course,
        name: editedName.trim()
      });
      setIsEditing(false);
    }
  };

  const handleToggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggleExpand) onToggleExpand();
    // Clear search when collapsing
    if (!newExpandedState) setSearchQuery('');
  };

  return (
    <div className={`course-folder ${isExpanded ? 'expanded' : ''}`}>
      <div className="course-header">
        <button
          className="toggle-btn"
          onClick={handleToggleExpand}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleUpdateCourseName}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdateCourseName()}
            autoFocus
            className="course-name-input"
          />
        ) : (
          <h4 className="course-title">{course.name}</h4>
        )}

        <div className="course-actions">
          <button
            className="icon-btn"
            onClick={() => setIsEditing(true)}
            aria-label="Edit course name"
          >
            <FiEdit />
          </button>
          <button
            className="icon-btn add-btn"
            onClick={() => setShowUploadModal(true)}
            aria-label={`Upload file to ${course.name}`}
          >
            <FiPlus />
          </button>
          <button
            className="icon-btn delete-btn"
            onClick={() => setShowDeleteModal(true)}
            aria-label={`Delete ${course.name}`}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="files-container">
          {/* Search bar */}
          <div className="file-search-container">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search files in this course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="file-search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {sortedAndFilteredFiles.length === 0 ? (
            <p className="empty-message">
              {searchQuery ? 
                'No files match your search.' : 
                'No files yet. Click the + button to add some.'}
            </p>
          ) : (
            <ul className="files-list">
              {sortedAndFilteredFiles.map(file => (
                <FileItem
                  key={file.id}
                  file={file}
                  onDelete={deleteFile}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {showUploadModal && (
        <UploadFileModal
          onClose={() => setShowUploadModal(false)}
          onSave={addFile}
          courseName={course.name}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${course.name}" and all its files?`}
          confirmText="Delete"
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

CourseFolder.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      content: PropTypes.any,
      createdAt: PropTypes.string
    }))
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool,
  onToggleExpand: PropTypes.func
};

CourseFolder.defaultProps = {
  isExpanded: false
};

export default React.memo(CourseFolder);