const API_BASE_URL = 'http://localhost:3001';
const API_URL = `${API_BASE_URL}/api/auth`;

export const signup = async (username, email, password) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Signup failed');
  }

  return response.json();
};

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const { token, user } = await response.json();
  if (token) {
    localStorage.setItem('user_token', token);
    localStorage.setItem('user_profile', JSON.stringify(user));
  }
  return { token, user };
};

export const logout = () => {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_profile');
};

export const getToken = () => {
  return localStorage.getItem('user_token');
};

export const getUserProfile = () => {
  const profile = localStorage.getItem('user_profile');
  return profile ? JSON.parse(profile) : null;
};

export const getCurrentUser = () => {
  return getUserProfile();
};

export const deleteUser = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found.');
  }

  const response = await fetch(`${API_URL}/delete-account`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Account deletion failed');
  }

  logout(); // Log out the user after successful deletion
  return response.json();
};

