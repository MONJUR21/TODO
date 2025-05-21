import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import CourseFolder from "./CourseFolder";
import AddCourseModal from "./AddCourseModal";
import {
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronRight,
  FiEdit,
} from "react-icons/fi";

function SemesterFolder({ semester, onUpdate, onDeleteRequest }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(semester.name);
  const [expandedCourses, setExpandedCourses] = useState({});

  // Add new course
  const addCourse = useCallback(
    (courseName) => {
      const newCourse = {
        id: Date.now(),
        name: courseName,
        files: [],
      };
      
      // Automatically expand the new course
      setExpandedCourses(prev => ({
        ...prev,
        [newCourse.id]: true
      }));
      
      // Also expand the semester if it's not already expanded
      if (!isExpanded) {
        setIsExpanded(true);
      }
      
      onUpdate({
        ...semester,
        courses: [...semester.courses, newCourse],
      });
    },
    [onUpdate, semester, isExpanded]
  );

  // Update existing course
  const updateCourse = useCallback(
    (updatedCourse) => {
      onUpdate({
        ...semester,
        courses: semester.courses.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        ),
      });
    },
    [onUpdate, semester]
  );

  // Delete a specific course
  const deleteCourse = useCallback(
    (courseId) => {
      // Remove from expanded state if present
      setExpandedCourses(prev => {
        const newState = {...prev};
        delete newState[courseId];
        return newState;
      });
      
      onUpdate({
        ...semester,
        courses: semester.courses.filter((course) => course.id !== courseId),
      });
    },
    [onUpdate, semester]
  );

  // Toggle course expansion
  const toggleCourseExpansion = useCallback((courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  }, []);

  // Handle semester name update
  const handleUpdateSemester = () => {
    if (editedName.trim()) {
      onUpdate({
        ...semester,
        name: editedName.trim(),
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="semester-folder">
      <div className="semester-header">
        <button
          className="toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? "Collapse" : "Expand"} semester`}
        >
          {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleUpdateSemester}
            onKeyPress={(e) => e.key === "Enter" && handleUpdateSemester()}
            autoFocus
            className="semester-name-input"
          />
        ) : (
          <h3>{semester.name}</h3>
        )}

        <div className="semester-actions">
          <button
            className="icon-btn edit-btn"
            onClick={() => setIsEditing(true)}
            aria-label="Edit semester name"
          >
            <FiEdit />
          </button>

          <button
            className="icon-btn"
            onClick={() => setShowAddCourseModal(true)}
            aria-label="Add course"
          >
            <FiPlus />
          </button>
          <button
            className="icon-btn delete-btn"
            onClick={() => onDeleteRequest(semester)}
            aria-label="Delete semester"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {isExpanded && semester.courses.length > 0 && (
        <div className="courses-container">
          {semester.courses.map((course) => (
            <CourseFolder
              key={course.id}
              course={course}
              isExpanded={!!expandedCourses[course.id]}
              onToggleExpand={() => toggleCourseExpansion(course.id)}
              onUpdate={updateCourse}
              onDelete={deleteCourse}
            />
          ))}
        </div>
      )}

      {/* Add course modal */}
      {showAddCourseModal && (
        <AddCourseModal
          onClose={() => setShowAddCourseModal(false)}
          onSave={addCourse}
        />
      )}
    </div>
  );
}

SemesterFolder.propTypes = {
  semester: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    courses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        files: PropTypes.array.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDeleteRequest: PropTypes.func.isRequired,
};

export default React.memo(SemesterFolder);