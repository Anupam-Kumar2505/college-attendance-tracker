import express from 'express';
import {
  getTeacherTimetable,
  getStudentTimetable,
  getTimetableById
} from '../controllers/timetableController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Teacher's timetable
router.get('/teacher', authenticate, authorize('TEACHER'), getTeacherTimetable);

// Student's timetable
router.get('/student', authenticate, authorize('STUDENT'), getStudentTimetable);

// Specific lecture details
router.get('/:id', authenticate, getTimetableById);

export default router;
