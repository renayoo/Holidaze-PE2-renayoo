const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export function saveAuthUser({ token, user }) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("userChanged"));
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function updateAuthUser(partialData) {
  const current = getAuthUser();
  const updated = {
    ...current,
    data: {
      ...current?.data,
      ...partialData,
    },
  };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("userChanged"));
  return updated;
}

export function clearAuthUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("userChanged"));
}
