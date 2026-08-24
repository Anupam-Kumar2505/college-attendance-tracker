import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.resolve(__dirname, 'data.json');
const FIXTURE_PATH = path.resolve(__dirname, '../seed/fixtures/sample_leave_proof.pdf');
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

// Ensure uploads directory and sample proof files exist
const ensureUploadFixtures = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  if (fs.existsSync(FIXTURE_PATH)) {
    const fixtureContent = fs.readFileSync(FIXTURE_PATH);
    const sampleFiles = [
      'proof-seed-rahul-medical.pdf',
      'proof-seed-priya-sports.pdf',
      'proof-seed-aman-conference.pdf'
    ];

    sampleFiles.forEach((fileName) => {
      const targetPath = path.join(UPLOADS_DIR, fileName);
      if (!fs.existsSync(targetPath)) {
        fs.writeFileSync(targetPath, fixtureContent);
      }
    });
  }
};

export const getJsonData = () => {
  ensureUploadFixtures();
  if (!fs.existsSync(DATA_FILE_PATH)) {
    return { users: [], timetable: [], leaveApplications: [] };
  }
  const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
  return JSON.parse(raw);
};

export const saveJsonData = (data) => {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};
