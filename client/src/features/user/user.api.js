const API_URL = 'http://localhost:3000/api/user';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const updateProfile = async (profileData) => {
  const hasFile = profileData.profilePicture instanceof File;

  let body;
  let headers = getAuthHeaders();

  if (hasFile) {
    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (key === 'profilePicture' && profileData[key] instanceof File) {
        formData.append('profilePicture', profileData[key]);
      } else if (profileData[key] !== undefined && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    });
    body = formData;
  } else {
    headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
    body = JSON.stringify(profileData);
  }

  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body,
  });

  const data = await response.json();
  return { ok: response.ok, ...data };
};
