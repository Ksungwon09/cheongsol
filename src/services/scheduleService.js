import { getToken } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE_URL}/api/schedule-images`;

export const getScheduleImages = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch schedule images');
  }

  return response.json();
};

export const uploadScheduleImage = async (formData) => {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Image upload failed');
  }

  return response.json();
};

export const deleteScheduleImage = async (id) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Image deletion failed');
  }

  return response.json();
};