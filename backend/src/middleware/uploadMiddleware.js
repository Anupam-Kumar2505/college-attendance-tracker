import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { getUploadsDir } from '../utils/fileStorage.js';
import { env } from '../config/env.js';

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = getUploadsDir();
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate safe unique filename: <timestamp>-<random-hex>.pdf
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const cleanExt = path.extname(file.originalname).toLowerCase() || '.pdf';
    cb(null, `proof-${uniqueSuffix}${cleanExt}`);
  }
});

// File filter: strictly allow application/pdf
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === 'application/pdf' && ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE: Only PDF files (.pdf) are accepted as attendance proof'), false);
  }
};

export const uploadProofPdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 // e.g. 10MB in bytes
  }
}).single('proofFile');
