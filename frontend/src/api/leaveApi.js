import apiClient from './client.js';

export const leaveApi = {
  submitLeaveApplication: async (formData) => {
    const response = await apiClient.post('/leave-applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getMyLeaveApplications: async () => {
    const response = await apiClient.get('/leave-applications/my');
    return response.data;
  },

  getLeaveApplicationById: async (id) => {
    const response = await apiClient.get(`/leave-applications/${id}`);
    return response.data;
  },

  getLectureLeaveApplications: async (lectureId) => {
    const response = await apiClient.get(`/teacher/lectures/${lectureId}/applications`);
    return response.data;
  },

  getProofPdfUrl: (applicationId, download = false) => {
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    return `${baseUrl}/leave-applications/${applicationId}/proof${download ? '?download=true' : ''}`;
  }
};
