import { Timetable } from '../models/Timetable.js';
import { LeaveApplication } from '../models/LeaveApplication.js';
import { User } from '../models/User.js';
import { isDatabaseConnected } from '../config/db.js';
import { getJsonData } from '../data/jsonDb.js';

export const getTeacherTimetable = async (teacherId) => {
  if (isDatabaseConnected()) {
    const lectures = await Timetable.find({ teacherId }).sort({ date: 1, startTime: 1 }).lean();

    return await Promise.all(
      lectures.map(async (lecture) => {
        const studentQuery = {
          role: 'STUDENT',
          year: lecture.year,
          branch: lecture.branch,
          classNumber: lecture.classNumber
        };
        if (lecture.batch) studentQuery.batch = lecture.batch;

        const classStudents = await User.find(studentQuery, '_id').lean();
        const studentIds = classStudents.map((s) => s._id);

        const leaveCount = await LeaveApplication.countDocuments({
          studentId: { $in: studentIds },
          startDate: { $lte: lecture.date },
          endDate: { $gte: lecture.date }
        });

        return { ...lecture, leaveCount };
      })
    );
  }

  // Local JSON Data Mode
  const data = getJsonData();
  const teacherIdStr = teacherId.toString();

  const lectures = data.timetable.filter(
    (l) => (l.teacherId?._id || l.teacherId).toString() === teacherIdStr
  );

  return lectures.map((lecture) => {
    // Find matching students in class & batch
    const classStudents = data.users.filter(
      (u) =>
        u.role === 'STUDENT' &&
        u.year === lecture.year &&
        u.branch === lecture.branch &&
        u.classNumber === lecture.classNumber &&
        (!lecture.batch || u.batch === lecture.batch)
    );

    const studentIdStrs = classStudents.map((s) => s._id.toString());

    // Count leaves covering lecture.date
    const leaveCount = data.leaveApplications.filter(
      (app) =>
        studentIdStrs.includes((app.studentId?._id || app.studentId).toString()) &&
        app.startDate <= lecture.date &&
        app.endDate >= lecture.date
    ).length;

    return {
      ...lecture,
      leaveCount
    };
  });
};

export const getStudentTimetable = async (student) => {
  if (isDatabaseConnected()) {
    const lectureQuery = {
      year: student.year,
      branch: student.branch,
      classNumber: student.classNumber,
      $or: [{ batch: null }, { batch: student.batch }]
    };

    const lectures = await Timetable.find(lectureQuery)
      .populate('teacherId', 'name email department employeeId')
      .sort({ date: 1, startTime: 1 })
      .lean();

    const studentLeaves = await LeaveApplication.find({ studentId: student._id }).lean();

    return lectures.map((lecture) => {
      const matchingLeave = studentLeaves.find(
        (leave) => leave.startDate <= lecture.date && leave.endDate >= lecture.date
      );

      return {
        ...lecture,
        hasLeave: Boolean(matchingLeave),
        leaveApplication: matchingLeave
          ? {
              id: matchingLeave._id,
              startDate: matchingLeave.startDate,
              endDate: matchingLeave.endDate,
              reason: matchingLeave.reason
            }
          : null
      };
    });
  }

  // Local JSON Data Mode
  const data = getJsonData();
  const studentIdStr = (student._id || student.id).toString();

  const studentLeaves = data.leaveApplications.filter(
    (app) => (app.studentId?._id || app.studentId).toString() === studentIdStr
  );

  const lectures = data.timetable.filter((l) => {
    const matchClass =
      l.year === student.year &&
      l.branch === student.branch &&
      l.classNumber === student.classNumber;
    const matchBatch = !l.batch || l.batch === student.batch;
    return matchClass && matchBatch;
  });

  return lectures.map((lecture) => {
    // Populate teacher object
    const teacher = data.users.find(
      (u) => u._id.toString() === (lecture.teacherId?._id || lecture.teacherId).toString()
    );

    const matchingLeave = studentLeaves.find(
      (leave) => leave.startDate <= lecture.date && leave.endDate >= lecture.date
    );

    return {
      ...lecture,
      teacherId: teacher
        ? {
            _id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            department: teacher.department,
            employeeId: teacher.employeeId
          }
        : lecture.teacherId,
      hasLeave: Boolean(matchingLeave),
      leaveApplication: matchingLeave
        ? {
            id: matchingLeave._id,
            startDate: matchingLeave.startDate,
            endDate: matchingLeave.endDate,
            reason: matchingLeave.reason
          }
        : null
    };
  });
};

export const getTimetableById = async (id) => {
  if (isDatabaseConnected()) {
    return await Timetable.findById(id).populate('teacherId', 'name email department employeeId').lean();
  }

  const data = getJsonData();
  const lecture = data.timetable.find((l) => l._id.toString() === id.toString());
  if (!lecture) return null;

  const teacher = data.users.find(
    (u) => u._id.toString() === (lecture.teacherId?._id || lecture.teacherId).toString()
  );

  return {
    ...lecture,
    teacherId: teacher || lecture.teacherId
  };
};
