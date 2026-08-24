import express from 'express';
import authRoutes from './authRoutes.js';
import timetableRoutes from './timetableRoutes.js';
import leaveApplicationRoutes from './leaveApplicationRoutes.js';
import teacherRoutes from './teacherRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/timetable', timetableRoutes);
router.use('/leave-applications', leaveApplicationRoutes);
router.use('/teacher', teacherRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'College Attendance & Leave Management API is online',
    timestamp: new Date().toISOString()
  });
});

export default router;
