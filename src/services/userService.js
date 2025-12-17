import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getUsers = () => {
  return axios.get(`${API_URL}/users`, { headers: getAuthHeaders() });
};

const deleteUser = (userId) => {
  return axios.delete(`${API_URL}/users/${userId}`, { headers: getAuthHeaders() });
};

const makeAdmin = (userId) => {
  return axios.put(`${API_URL}/users/${userId}/make-admin`, {}, { headers: getAuthHeaders() });
};

const getUserStats = () => {
  return axios.get(`${API_URL}/users/stats`, { headers: getAuthHeaders() });
};

const userService = {
  getUsers,
  deleteUser,
  makeAdmin,
  getUserStats,
};

export default userService;
