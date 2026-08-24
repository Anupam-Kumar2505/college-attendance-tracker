import express from 'express';
import {
  createLeaveApplication,
  getMyApplications,
  getApplicationById,
  getProofPdf
} from '../controllers/leaveApplicationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { uploadProofPdf } from '../middleware/uploadMiddleware.js';
import { validateLeaveApplicationInput } from '../validators/leaveValidators.js';

const router = express.Router();

// Student applies for leave with mandatory proof PDF
router.post('/', authenticate, authorize('STUDENT'), uploadProofPdf, validateLeaveApplicationInput, createLeaveApplication);

// Student views their own leave applications
router.get('/my', authenticate, authorize('STUDENT'), getMyApplications);

// Secure access to original uploaded proof PDF
router.get('/:id/proof', authenticate, getProofPdf);

// Get single leave application details
router.get('/:id', authenticate, getApplicationById);

export default router;
