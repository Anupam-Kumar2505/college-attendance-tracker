import {
  getTeacherTimetable as getTeacherTimetableService,
  getStudentTimetable as getStudentTimetableService,
  getTimetableById as getTimetableByIdService
} from '../services/timetableService.js';

export const getTeacherTimetable = async (req, res, next) => {
  try {
    const timetable = await getTeacherTimetableService(req.user._id);
    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentTimetable = async (req, res, next) => {
  try {
    const timetable = await getStudentTimetableService(req.user);
    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

export const getTimetableById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lecture = await getTimetableByIdService(id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lecture
    });
  } catch (error) {
    next(error);
  }
};
