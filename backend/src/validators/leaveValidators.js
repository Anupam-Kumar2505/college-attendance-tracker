import { isDateRangeValid } from '../utils/dateUtils.js';

export const validateLeaveApplicationInput = (req, res, next) => {
  const { startDate, endDate, reason, details } = req.body;

  if (!startDate || typeof startDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return res.status(400).json({
      success: false,
      message: 'Valid Start Date (YYYY-MM-DD) is required'
    });
  }

  if (!endDate || typeof endDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return res.status(400).json({
      success: false,
      message: 'Valid End Date (YYYY-MM-DD) is required'
    });
  }

  if (!isDateRangeValid(startDate, endDate)) {
    return res.status(400).json({
      success: false,
      message: 'Start Date must be before or equal to End Date'
    });
  }

  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Category of leave is required'
    });
  }

  // Mandatory Proof PDF verification
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Proof PDF document is mandatory. Please upload a valid .pdf file.'
    });
  }

  if (req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({
      success: false,
      message: 'Only PDF files (application/pdf) are accepted as proof'
    });
  }

  next();
};
