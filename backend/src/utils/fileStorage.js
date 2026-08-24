import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUploadsDir = () => {
  const uploadPath = path.resolve(__dirname, '../../', env.UPLOAD_DIR);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
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

  return fullPath;
};
