import React, { useState, useEffect } from "react";
import SemesterFolder from "./components/SemesterFolder";
import AddSemesterModal from "./components/AddSemesterModal";
import { FiPlus } from "react-icons/fi";
import "./App.css";
import { registerSW } from "virtual:pwa-register";
import { initDB, getSemesters, saveSemester, deleteSemester } from './db';

// PWA registration
const updateSW = registerSW({
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
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize IndexedDB on first render
  useEffect(() => {
    async function initializeDB() {
      await initDB();
      setDbInitialized(true);
    }
    initializeDB();
  }, []);

  // Load data from IndexedDB when DB is initialized
  useEffect(() => {
    if (!dbInitialized) return;

    async function loadSemesters() {
      const savedSemesters = await getSemesters();
      setSemesters(savedSemesters);
    }
    loadSemesters();
  }, [dbInitialized]);

  const addSemester = async (semesterName) => {
    const newSemester = {
      id: Date.now(),
      name: semesterName,
      courses: [],
    };
    await saveSemester(newSemester);
    setSemesters([...semesters, newSemester]);
  };

  const updateSemester = async (updatedSemester) => {
    await saveSemester(updatedSemester);
    setSemesters(
      semesters.map((sem) =>
        sem.id === updatedSemester.id ? updatedSemester : sem
      )
    );
  };

  const deleteSemester = async (semesterId) => {
    await deleteSemester(semesterId);
    setSemesters(semesters.filter((sem) => sem.id !== semesterId));
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
              onDelete={deleteSemester}
            />
          ))}

          <button
            className="add-semester-btn"
            onClick={() => setShowAddSemesterModal(true)}
          >
            <FiPlus /> Add Semester
          </button>
        </div>
      </main>

      {showAddSemesterModal && (
        <AddSemesterModal
          onClose={() => setShowAddSemesterModal(false)}
          onSave={addSemester}
        />
      )}
    </div>
  );
}

export default App;