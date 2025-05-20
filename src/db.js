// src/db.js
import { openDB } from 'idb';

const DB_NAME = 'SemesterNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'semesters';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function getSemesters() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function saveSemester(semester) {
  const db = await initDB();
  return db.put(STORE_NAME, semester);
}

export async function deleteSemester(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}