import axios from 'axios';
import { getAccessToken, clearAuth } from './auth';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 giây timeout
});

// Interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized) - token hết hạn
    if (error.response?.status === 401) {
      clearAuth();
      // Chỉ redirect nếu không phải trang login (tránh redirect loop)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Xử lý lỗi 403 (Forbidden) - không có quyền
    if (error.response?.status === 403) {
      console.error('Không có quyền truy cập');
    }
    
    // Xử lý lỗi 500 (Internal Server Error)
    if (error.response?.status >= 500) {
      console.error('Lỗi server');
    }
    
    return Promise.reject(error);
  }
);

// Tạo instance riêng cho API phòng khám (port 3002)
const roomApiClient = axios.create({
  baseURL: 'http://localhost:3002/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Interceptor cho room API
roomApiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Thêm cache-busting parameter để tránh 304 Not Modified
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now() // Timestamp để force refresh
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

roomApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Tạo instance riêng cho API dịch vụ (port 3003)
const serviceApiClient = axios.create({
  baseURL: 'http://localhost:3003/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor cho service API
serviceApiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

serviceApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Tạo instance riêng cho API ca làm việc (port 3004)
const shiftApiClient = axios.create({
  baseURL: 'http://localhost:3004/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor cho shift API
shiftApiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

shiftApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient, roomApiClient, serviceApiClient, shiftApiClient };
