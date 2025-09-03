// Auth helper utilities
// Mục tiêu: đơn giản, dễ hiểu, dễ dùng lại.
// - Lưu access token và thông tin user vào localStorage
// - Lấy access token để gắn vào request
// - Xoá thông tin đăng nhập khi cần đăng xuất

// KEY đặt trong localStorage
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

// Lưu thông tin đăng nhập sau khi gọi API /login thành công
// - accessToken: chuỗi token BE trả
// - user: object thông tin người dùng (id, role, email, ...)
export function setAuth({ accessToken, user }) {
  if (typeof accessToken === 'string' && accessToken.length > 0) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (user && typeof user === 'object') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

// Lấy access token để gắn vào header Authorization
export function getAccessToken() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token || '';
}

// Lấy thông tin user hiện tại (đã parse từ JSON)
export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    // Nếu parse lỗi, coi như chưa có user
    return null;
  }
}

// Xoá thông tin đăng nhập (dùng khi logout)
export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
