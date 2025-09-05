import { serviceApiClient } from './axiosConfig';
import { getAccessToken } from './auth';

// Service quản lý dịch vụ
export const serviceService = {
  // Lấy danh sách dịch vụ với phân trang
  async list(page = 1, limit = 10) {
    const response = await serviceApiClient.get(`/service?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Tìm kiếm dịch vụ với phân trang
  async search(keyword, page = 1, limit = 10) {
    const q = encodeURIComponent(keyword || '');
    const response = await serviceApiClient.get(`/service/search?q=${q}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Tạo dịch vụ mới
  async create(payload) {
    if (!getAccessToken()) throw new Error('Bạn chưa đăng nhập hoặc phiên đã hết hạn');
    const response = await serviceApiClient.post('/service', payload);
    return response.data;
  },

  // Cập nhật dịch vụ
  async update(id, payload) {
    if (!getAccessToken()) throw new Error('Bạn chưa đăng nhập hoặc phiên đã hết hạn');
    const response = await serviceApiClient.put(`/service/${id}`, payload);
    return response.data;
  },

  // Chuyển đổi trạng thái dịch vụ
  async toggleStatus(id) {
    if (!getAccessToken()) throw new Error('Bạn chưa đăng nhập hoặc phiên đã hết hạn');
    const response = await serviceApiClient.patch(`/service/${id}/toggle`);
    return response.data;
  },
};
