import express from 'express';
import { getLectureApplications } from '../controllers/teacherLectureController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Teacher views students on leave for a specific lecture
router.get('/lectures/:lectureId/applications', authenticate, authorize('TEACHER'), getLectureApplications);

export default router;
