import { getLeaveApplicationsForLecture as getLeaveApplicationsForLectureService } from '../services/leaveApplicationService.js';

export const getLectureApplications = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const result = await getLeaveApplicationsForLectureService(lectureId, req.user._id);

    res.status(200).json({
      success: true,
      data: result
    });
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
