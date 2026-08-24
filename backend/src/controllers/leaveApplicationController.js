import fs from 'fs';
import {
  createLeaveApplication as createLeaveApplicationService,
  getStudentLeaveApplications as getStudentLeaveApplicationsService,
  getLeaveApplicationById as getLeaveApplicationByIdService,
  getProofDocument as getProofDocumentService
} from '../services/leaveApplicationService.js';

export const createLeaveApplication = async (req, res, next) => {
  try {
    const application = await createLeaveApplicationService(req.user._id, req.body, req.file);
    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully with proof PDF',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await getStudentLeaveApplicationsService(req.user._id);
    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await getLeaveApplicationByIdService(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Leave application not found'
      });
    }

    // Role ownership check
    if (req.user.role === 'STUDENT' && application.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot access another student’s application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const getProofPdf = async (req, res, next) => {
  try {
    const { id } = req.params;
    const download = req.query.download === 'true';

    const { filePath, fileName, mimeType } = await getProofDocumentService(id, req.user);

    const disposition = download ? `attachment; filename="${fileName}"` : `inline; filename="${fileName}"`;

    res.setHeader('Content-Type', mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', disposition);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};
