import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { getUploadsDir } from '../utils/fileStorage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const READONLY_DATA_FILE_PATH = path.resolve(__dirname, 'data.json');
const TMP_DATA_FILE_PATH = path.join(os.tmpdir(), 'college_attendance_data.json');
const FIXTURE_PATH = path.resolve(__dirname, '../seed/fixtures/sample_leave_proof.pdf');

let inMemoryData = null;
let fixturesEnsured = false;

// Ensure uploads directory and sample proof files exist safely
export const ensureUploadFixtures = () => {
  if (fixturesEnsured) return;
  try {
    const uploadsDir = getUploadsDir();

    if (fs.existsSync(FIXTURE_PATH)) {
      const fixtureContent = fs.readFileSync(FIXTURE_PATH);
      const sampleFiles = [
        'proof-seed-rahul-medical.pdf',
        'proof-seed-priya-sports.pdf',
        'proof-seed-aman-conference.pdf'
      ];

      sampleFiles.forEach((fileName) => {
        try {
          const targetPath = path.join(uploadsDir, fileName);
          if (!fs.existsSync(targetPath)) {
            fs.writeFileSync(targetPath, fixtureContent);
          }
        } catch (fileErr) {
          // Gracefully ignore individual file write error in read-only environment
        }
      });
    }
    fixturesEnsured = true;
  } catch (err) {
    // Non-fatal: Ignore error if filesystem is strictly read-only
    console.warn('[Storage] Notice: Upload fixtures could not be written to disk:', err.message);
  }
};

export const getJsonData = () => {
  ensureUploadFixtures();

  if (inMemoryData) {
    return inMemoryData;
  }

  // 1. Try reading from temporary writable path if updated
  if (fs.existsSync(TMP_DATA_FILE_PATH)) {
    try {
      const raw = fs.readFileSync(TMP_DATA_FILE_PATH, 'utf-8');
      inMemoryData = JSON.parse(raw);
      return inMemoryData;
    } catch (err) {
      console.warn('[Storage] Failed reading tmp data.json, falling back to source data.json:', err.message);
    }
  }

  // 2. Read from bundled source data.json
  if (!fs.existsSync(READONLY_DATA_FILE_PATH)) {
    inMemoryData = { users: [], timetable: [], leaveApplications: [] };
    return inMemoryData;
  }

  try {
    const raw = fs.readFileSync(READONLY_DATA_FILE_PATH, 'utf-8');
    inMemoryData = JSON.parse(raw);
    return inMemoryData;
  } catch (err) {
    console.error('[Storage] Error reading data.json:', err.message);
    return { users: [], timetable: [], leaveApplications: [] };
  }
};

export const saveJsonData = (data) => {
  inMemoryData = data;
  const serialized = JSON.stringify(data, null, 2);

  // Try saving to original location first (for local development)
  try {
    fs.writeFileSync(READONLY_DATA_FILE_PATH, serialized, 'utf-8');
    return;
  } catch (err) {
    // In serverless / read-only environment (EROFS), save to /tmp
    try {
      fs.writeFileSync(TMP_DATA_FILE_PATH, serialized, 'utf-8');
    } catch (tmpErr) {
      console.warn('[Storage] Unable to persist data to tmpdir, retaining in-memory:', tmpErr.message);
    }
  }
};
