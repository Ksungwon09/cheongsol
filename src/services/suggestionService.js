import { getToken } from './authService';

const API_BASE_URL = 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getSuggestions = async () => { // New function for Admin page
    const response = await fetch(`${API_BASE_URL}/api/suggestions`, { headers: getAuthHeaders() });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch all suggestions');
    }
    return response.json();
};

export const getSuggestionsByCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/suggestions/my-suggestions`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user suggestions');
  }
  return response.json();
};

export const addSuggestion = async (suggestion) => {
  const response = await fetch(`${API_BASE_URL}/api/suggestions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(suggestion),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add suggestion');
  }
  return response.json();
};

export const updateSuggestionStatus = async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/api/suggestions/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update suggestion status');
    }
    return response.json();
};
