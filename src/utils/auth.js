export function setAuth({ accessToken, user }) {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (user) localStorage.setItem('user', JSON.stringify(user));
}

export function getAccessToken() {
  return localStorage.getItem('accessToken') || '';
}

export function getUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}
