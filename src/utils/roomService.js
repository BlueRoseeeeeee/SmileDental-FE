import { getAccessToken } from './auth';

const BASE_URL = 'http://localhost:3002/api/room';

function buildHeaders(isJson = false) {
  const token = getAccessToken();
  const headers = { Accept: 'application/json' };
  if (isJson) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(path, { method = 'GET', body, json = true } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(json && !!body),
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? (()=>{ try { return JSON.parse(text); } catch { return { message: text }; } })() : {};
  if (!res.ok) {
    throw new Error(data?.message || `${res.status} ${res.statusText}`);
  }
  return data;
}

export const roomService = {
  // GET /api/room
  async list() {
    return request('');
  },

  // GET /api/room/search?q=keyword
  async search(keyword) {
    const q = encodeURIComponent(keyword || '');
    return request(`/search?q=${q}`);
  },

  // POST /api/room
  async create(payload) {
    if (!getAccessToken()) throw new Error('Bạn chưa đăng nhập hoặc phiên đã hết hạn');
    return request('', { method: 'POST', body: payload });
  },

  // PUT /api/room/:id
  async update(id, payload) {
    if (!getAccessToken()) throw new Error('Bạn chưa đăng nhập hoặc phiên đã hết hạn');
    return request(`/${id}`, { method: 'PUT', body: payload });
  },
};
