const API_URL = 'http://localhost:3000/api/posts';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const createPost = async ({ media, caption }) => {
  const formData = new FormData();
  formData.append('media', media);
  formData.append('caption', caption || '');

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  const data = await response.json();
  return { ok: response.ok, ...data };
};

export const fetchFeed = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const data = await response.json();
  return { ok: response.ok, ...data };
};
