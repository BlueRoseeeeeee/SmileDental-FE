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

  /**
   * Search staff by name or email with pagination
   * @param {string} searchTerm - Search term (fullName or email)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} API response
   */
  search: async (searchTerm, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/user/staff/search', {
        params: { fullName: searchTerm, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching staff:', error);
      throw error;
    }
  },

  /**
   * Get staff by ID
   * @param {string} id - Staff ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff by ID:', error);
      throw error;
    }
  },

  /**
   * Update staff information
   * @param {string} id - Staff ID
   * @param {object} data - Staff data to update
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    try {
      console.log('API Update Request:', { id, data }); // Debug log
      const response = await apiClient.put(`/user/update/${id}`, data);
      console.log('API Update Response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  },
}
