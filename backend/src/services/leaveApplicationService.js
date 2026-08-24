import fs from 'fs';
import { LeaveApplication } from '../models/LeaveApplication.js';
import { Timetable } from '../models/Timetable.js';
import { User } from '../models/User.js';
import { isDatabaseConnected } from '../config/db.js';
import { getJsonData, saveJsonData } from '../data/jsonDb.js';
import { getSafeFilePath } from '../utils/fileStorage.js';

export const createLeaveApplication = async (studentId, data, file) => {
  const { startDate, endDate, reason, details } = data;
  const cleanDetails = (details || '').trim();

  if (isDatabaseConnected()) {
    const application = new LeaveApplication({
      studentId,
      startDate,
      endDate,
      reason: reason.trim(),
      details: cleanDetails,
      proofFileName: file.originalname,
      proofMimeType: file.mimetype,
      proofFilePath: file.filename,
      proofFileSize: file.size
    });

    await application.save();
    return application;
  }

  // Local JSON Data Mode
  const jsonData = getJsonData();
  const newApp = {
    _id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    studentId: studentId.toString(),
    startDate,
    endDate,
    reason: reason.trim(),
    details: cleanDetails,
    proofFileName: file.originalname,
    proofMimeType: file.mimetype,
    proofFilePath: file.filename,
    proofFileSize: file.size,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  jsonData.leaveApplications.unshift(newApp);
  saveJsonData(jsonData);
  return newApp;
};

export const getStudentLeaveApplications = async (studentId) => {
  if (isDatabaseConnected()) {
    return await LeaveApplication.find({ studentId }).sort({ startDate: -1, createdAt: -1 }).lean();
  }

  const data = getJsonData();
  const studentIdStr = studentId.toString();
  return data.leaveApplications.filter(
    (app) => (app.studentId?._id || app.studentId).toString() === studentIdStr
  );
};

export const getLeaveApplicationById = async (id) => {
  if (isDatabaseConnected()) {
    return await LeaveApplication.findById(id)
      .populate('studentId', 'name email studentId rollNo sapId year branch classNumber batch')
      .lean();
  }

  const data = getJsonData();
  const app = data.leaveApplications.find((a) => a._id.toString() === id.toString());
  if (!app) return null;

  const student = data.users.find(
    (u) => u._id.toString() === (app.studentId?._id || app.studentId).toString()
  );

  return {
    ...app,
    studentId: student || app.studentId
  };
};

export const getLeaveApplicationsForLecture = async (lectureId, teacherId) => {
  if (isDatabaseConnected()) {
    const lecture = await Timetable.findById(lectureId).lean();
    if (!lecture) {
      const error = new Error('Lecture not found');
      error.statusCode = 404;
      throw error;
    }

    if (lecture.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Forbidden: You are not authorized to view applications for this lecture');
      error.statusCode = 403;
      throw error;
    }

    const studentQuery = {
      role: 'STUDENT',
      year: lecture.year,
      branch: lecture.branch,
      classNumber: lecture.classNumber
    };
    if (lecture.batch) studentQuery.batch = lecture.batch;

    const studentsInClass = await User.find(studentQuery).lean();
    const studentIds = studentsInClass.map((s) => s._id);

    const applications = await LeaveApplication.find({
      studentId: { $in: studentIds },
      startDate: { $lte: lecture.date },
      endDate: { $gte: lecture.date }
    })
      .populate('studentId', 'name email studentId rollNo sapId year branch classNumber batch')
      .sort({ createdAt: -1 })
      .lean();

    return { lecture, applications };
  }

  // Local JSON Data Mode
  const data = getJsonData();
  const lecture = data.timetable.find((l) => l._id.toString() === lectureId.toString());

  if (!lecture) {
    const error = new Error('Lecture not found');
    error.statusCode = 404;
    throw error;
  }

  const lectureTeacherId = (lecture.teacherId?._id || lecture.teacherId).toString();
  if (lectureTeacherId !== teacherId.toString()) {
    const error = new Error('Forbidden: You are not authorized to view applications for this lecture');
    error.statusCode = 403;
    throw error;
  }

  // Find students belonging to lecture class and batch
  const studentsInClass = data.users.filter(
    (u) =>
      u.role === 'STUDENT' &&
      u.year === lecture.year &&
      u.branch === lecture.branch &&
      u.classNumber === lecture.classNumber &&
      (!lecture.batch || u.batch === lecture.batch)
  );

  const studentMap = {};
  studentsInClass.forEach((s) => {
    studentMap[s._id.toString()] = s;
  });

  const matchingApplications = data.leaveApplications
    .filter((app) => {
      const sId = (app.studentId?._id || app.studentId).toString();
      const inClass = Boolean(studentMap[sId]);
      const dateCovers = app.startDate <= lecture.date && app.endDate >= lecture.date;
      return inClass && dateCovers;
    })
    .map((app) => {
      const sId = (app.studentId?._id || app.studentId).toString();
      const studentObj = studentMap[sId] ? { ...studentMap[sId] } : app.studentId;
      if (studentObj && studentObj.passwordHash) delete studentObj.passwordHash;
      return {
        ...app,
        studentId: studentObj
      };
    });

  return {
    lecture,
    applications: matchingApplications
  };
};

export const getProofDocument = async (applicationId, user) => {
  let application = null;
  let student = null;

  if (isDatabaseConnected()) {
    application = await LeaveApplication.findById(applicationId);
    if (application) {
      student = await User.findById(application.studentId).lean();
    }
  } else {
    const data = getJsonData();
    application = data.leaveApplications.find((a) => a._id.toString() === applicationId.toString());
    if (application) {
      student = data.users.find(
        (u) => u._id.toString() === (application.studentId?._id || application.studentId).toString()
      );
    }
  }

  if (!application) {
    const error = new Error('Leave application not found');
    error.statusCode = 404;
    throw error;
  }

  let isAuthorized = false;
  const currentUserIdStr = (user._id || user.id).toString();
  const appStudentIdStr = (application.studentId?._id || application.studentId).toString();

  if (user.role === 'STUDENT') {
    if (appStudentIdStr === currentUserIdStr) {
      isAuthorized = true;
    }
  } else if (user.role === 'TEACHER') {
    if (student) {
      if (isDatabaseConnected()) {
        const relevantLectures = await Timetable.find({
          teacherId: user._id,
          year: student.year,
          branch: student.branch,
          classNumber: student.classNumber,
          date: {
            $gte: application.startDate,
            $lte: application.endDate
          }
        });
        if (relevantLectures && relevantLectures.length > 0) isAuthorized = true;
      } else {
        const data = getJsonData();
        const hasMatchingLecture = data.timetable.some((l) => {
          const lTeacher = (l.teacherId?._id || l.teacherId).toString();
          const isTeacher = lTeacher === currentUserIdStr;
          const matchClass =
            l.year === student.year &&
            l.branch === student.branch &&
            l.classNumber === student.classNumber;
          const inDateRange = l.date >= application.startDate && l.date <= application.endDate;
          return isTeacher && matchClass && inDateRange;
        });
        if (hasMatchingLecture) isAuthorized = true;
      }
    }
  }

  if (!isAuthorized) {
    const error = new Error('Forbidden: You are not authorized to access this proof document');
    error.statusCode = 403;
    throw error;
  }

  const fullPath = getSafeFilePath(application.proofFilePath);
  if (!fs.existsSync(fullPath)) {
    const error = new Error('Proof document file not found on server storage');
    error.statusCode = 404;
    throw error;
  }

  return {
    filePath: fullPath,
    fileName: application.proofFileName,
    mimeType: application.proofMimeType
  };
};
