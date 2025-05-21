import React, { useState, useEffect } from "react";
import SemesterFolder from "./components/SemesterFolder";
import AddSemesterModal from "./components/AddSemesterModal";
import { FiPlus } from "react-icons/fi";
import "./App.css";
import { registerSW } from "virtual:pwa-register";
import {
  initDB,
  getSemesters,
  saveSemester,
  deleteSemester as deleteSemesterFromDB,
} from "./db";

// PWA registration
registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Refresh to update?")) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log("App is ready for offline use");
  },
});

function App() {
  const [semesters, setSemesters] = useState([]);
  const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize IndexedDB
  useEffect(() => {
    async function initializeDB() {
      await initDB();
      setDbInitialized(true);
    }
    initializeDB();
  }, []);

  // Load data when DB is ready
  useEffect(() => {
    if (!dbInitialized) return;

    async function loadSemesters() {
      const savedSemesters = await getSemesters();
      setSemesters(savedSemesters);
    }
    loadSemesters();
  }, [dbInitialized]);

  const handleAddSemester = async (semesterName) => {
    try {
      const newSemester = {
        id: Date.now(),
        name: semesterName,
        courses: [],
      };
      await saveSemester(newSemester);
      setSemesters((prev) => [...prev, newSemester]);
      setShowAddSemesterModal(false);
    } catch (error) {
      console.error("Failed to add semester:", error);
      alert("Failed to add semester. Please try again.");
    }
  };

  const updateSemester = async (updatedSemester) => {
    try {
      await saveSemester(updatedSemester);
      setSemesters((prev) =>
        prev.map((sem) =>
          sem.id === updatedSemester.id ? updatedSemester : sem
        )
      );
    } catch (error) {
      console.error("Failed to update semester:", error);
    }
  };

  const handleDeleteSemester = async (semesterId) => {
    try {
      await deleteSemesterFromDB(semesterId);
      setSemesters((prev) => prev.filter((sem) => sem.id !== semesterId));
    } catch (error) {
      console.error("Failed to delete semester:", error);
      alert("Failed to delete semester. Please try again.");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Semester Notes Organizer</h1>
        <p>Keep your course materials organized by semester</p>
      </header>

      <main className="app-main">
        <div className="semesters-container">
          {semesters.map((semester) => (
            <SemesterFolder
              key={semester.id}
              semester={semester}
              onUpdate={updateSemester}
              onDeleteRequest={setSemesterToDelete}
            />
          ))}

          <button
            className="add-semester-btn"
            onClick={() => setShowAddSemesterModal(true)}
            aria-label="Add new semester"
          >
            <FiPlus /> Add Semester
          </button>
        </div>
      </main>

      {showAddSemesterModal && (
        <AddSemesterModal
          onClose={() => setShowAddSemesterModal(false)}
          onSave={handleAddSemester}
        />
      )}

      {semesterToDelete && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{semesterToDelete.name}</strong> and all its contents?
            </p>
            <div className="modal-actions">
              <button
                className="btn secondary"
                onClick={() => setSemesterToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn danger"
                onClick={() => {
                  handleDeleteSemester(semesterToDelete.id);
                  setSemesterToDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
