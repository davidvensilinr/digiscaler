const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const headers = {
  'Content-Type': 'application/json',
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

/* =========================== AUTH =========================== */
export const signup = (payload) =>
  fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const login = (email, password) =>
  fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);

/* =========================== USERS =========================== */
export const fetchUsers = (type) => {
  const url = type ? `${API_BASE}/users?type=${type}` : `${API_BASE}/users`;
  return fetch(url).then(handleResponse);
};

/* =========================== CONVERSATIONS & MESSAGES =========================== */
export const fetchConversation = (participant1, participant2) => {
  const url = `${API_BASE}/conversations?participant1=${encodeURIComponent(participant1)}&participant2=${encodeURIComponent(participant2)}`;
  return fetch(url).then(handleResponse);
};

export const sendMessage = (payload) =>
  fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  }).then(handleResponse); 