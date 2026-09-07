import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUploadsDir = () => {
  let uploadPath;
  if (env.IS_SERVERLESS) {
    uploadPath = path.isAbsolute(env.UPLOAD_DIR) && env.UPLOAD_DIR.startsWith(os.tmpdir())
      ? env.UPLOAD_DIR
      : path.join(os.tmpdir(), 'uploads');
  } else if (path.isAbsolute(env.UPLOAD_DIR)) {
    uploadPath = env.UPLOAD_DIR;
  } else {
    uploadPath = path.resolve(__dirname, '../../', env.UPLOAD_DIR);
  }

  try {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  } catch (err) {
    // If permission or EROFS error occurs on the primary path, fallback to os.tmpdir()/uploads
    const fallbackPath = path.join(os.tmpdir(), 'uploads');
    try {
      if (!fs.existsSync(fallbackPath)) {
        fs.mkdirSync(fallbackPath, { recursive: true });
      }
      return fallbackPath;
    } catch (fallbackErr) {
      console.warn('[Storage] Notice: Could not create uploads directory in tmpdir:', fallbackErr.message);
    }
  }

  return uploadPath;
};

export const getSafeFilePath = (fileName) => {
  const baseUploadsDir = getUploadsDir();
  // Strip any directory traversal sequences
  const sanitized = path.basename(fileName);
  const fullPath = path.join(baseUploadsDir, sanitized);

  // Security check: ensure path is inside uploads directory
  if (!fullPath.startsWith(baseUploadsDir)) {
    throw new Error('Access denied: Path traversal detected');
  }

  if (fs.existsSync(fullPath)) {
    return fullPath;
  }

  // Fallback to sample fixture if a seeded proof file is requested
  if (sanitized.startsWith('proof-seed-')) {
    const fixturePath = path.resolve(__dirname, '../seed/fixtures/sample_leave_proof.pdf');
    if (fs.existsSync(fixturePath)) {
      return fixturePath;
    }
  }

  return fullPath;
};
