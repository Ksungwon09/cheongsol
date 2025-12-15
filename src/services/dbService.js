import { getToken } from './authService';

const API_BASE_URL = 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// --- Announcements ---
export const getAnnouncements = async () => {
  const response = await fetch(`${API_BASE_URL}/api/announcements`);
  if (!response.ok) throw new Error('Failed to fetch announcements');
  return response.json();
};

export const addAnnouncement = async (announcement) => {
  const response = await fetch(`${API_BASE_URL}/api/announcements`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(announcement),
  });
  if (!response.ok) throw new Error('Failed to add announcement');
  return response.json();
};

export const deleteAnnouncement = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/announcements/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete announcement');
  return response.json();
};

// --- Booths ---
export const getBooths = async () => {
    const response = await fetch(`${API_BASE_URL}/api/booths`);
    if (!response.ok) throw new Error('Failed to fetch booths');
    return response.json();
};
  
export const addBooth = async (booth) => {
    const response = await fetch(`${API_BASE_URL}/api/booths`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(booth),
    });
    if (!response.ok) throw new Error('Failed to add booth');
    return response.json();
};

export const deleteBooth = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/booths/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete booth');
    return response.json();
};



// This is a placeholder for the popup logic which needs to be re-implemented
export const getPopupAnnouncements = async () => {
    const announcements = await getAnnouncements();
    // This logic needs to be more robust, maybe a dedicated endpoint
    return announcements.filter(a => a.isPopup).slice(0, 1);
};
