import { apiClient } from './axiosConfig';


export const staffService = {
  /**
   * Get all staff with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} API response
   */
  list: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/user/all-staff', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  /**
   * Search staff by role with pagination
   */
  searchByRole: async (role, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/user/by-role', {
        params: { role, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching staff by role:', error);
      throw error;
    }
  },
}
