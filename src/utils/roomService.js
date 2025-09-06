import { roomApiClient } from './axiosConfig';
import { getAccessToken } from './auth';

// Service quản lý phòng khám
export const roomService = {
  // Lấy danh sách phòng với phân trang
  async list(page = 1, limit = 10) {
    const response = await roomApiClient.get(`/room?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Tìm kiếm phòng với phân trang
  async search(keyword, page = 1, limit = 10) {
    const q = encodeURIComponent(keyword || '');
    const response = await roomApiClient.get(`/room/search?q=${q}&page=${page}&limit=${limit}`);
    return response.data;
  },


  // Tạo phòng mới
  async create(payload) {
    if (!getAccessToken()) throw new Error('Bạn chưa đăng nhập hoặc phiên đã hết hạn');
    const response = await roomApiClient.post('/room', payload);
    return response.data;
  },

  // Cập nhật phòng
  async update(id, payload) {
    if (!getAccessToken()) throw new Error('Bạn chưa đăng nhập hoặc phiên đã hết hạn');
    const response = await roomApiClient.put(`/room/${id}`, payload);
    return response.data;
  },

  // Chuyển đổi trạng thái phòng
  async toggleStatus(id) {
    if (!getAccessToken()) throw new Error('Bạn chưa đăng nhập hoặc phiên đã hết hạn');
    const response = await roomApiClient.patch(`/room/${id}/toggle`);
    return response.data;
  },
};
