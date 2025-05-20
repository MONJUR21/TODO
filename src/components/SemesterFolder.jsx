import React, { useState } from 'react';
import CourseFolder from './CourseFolder';
import AddCourseModal from './AddCourseModal';
import ConfirmationModal from './ConfirmationModal';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import '../styles/variables.css';

function SemesterFolder({ semester, onUpdate, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const addCourse = (courseName) => {
    const newCourse = {
      id: Date.now(),
      name: courseName,
      files: []
    };
    onUpdate({
      ...semester,
      courses: [...semester.courses, newCourse]
    });
  };

  const updateCourse = (updatedCourse) => {
    onUpdate({
      ...semester,
      courses: semester.courses.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    });
  };

  const deleteCourse = (courseId) => {
    onUpdate({
      ...semester,
      courses: semester.courses.filter(course => course.id !== courseId)
    });
  };

  return (
    <div className="semester-folder">
      <div className="semester-header">
        <button 
          className="toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
        </button>
        <h3>{semester.name}</h3>
        <div className="semester-actions">
          <button 
            className="icon-btn"
            onClick={() => setShowAddCourseModal(true)}
            aria-label="Add course"
          >
            <FiPlus />
          </button>
          <button 
            className="icon-btn delete-btn"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Delete semester"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="courses-container">
          {semester.courses.map(course => (
            <CourseFolder
              key={course.id}
              course={course}
              onUpdate={updateCourse}
              onDelete={deleteCourse}
            />
          ))}
        </div>
      )}

      {showAddCourseModal && (
        <AddCourseModal
          onClose={() => setShowAddCourseModal(false)}
          onSave={addCourse}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          message={`Are you sure you want to delete ${semester.name} and all its contents?`}
          onConfirm={() => {
            onDelete(semester.id);
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default SemesterFolder;