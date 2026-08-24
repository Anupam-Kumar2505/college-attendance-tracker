import apiClient from './client.js';

export const timetableApi = {
  getTeacherTimetable: async () => {
    const response = await apiClient.get('/timetable/teacher');
    return response.data;
  },

  getStudentTimetable: async () => {
    const response = await apiClient.get('/timetable/student');
    return response.data;
  },

  getLectureById: async (id) => {
    const response = await apiClient.get(`/timetable/${id}`);
    return response.data;
  }
};
