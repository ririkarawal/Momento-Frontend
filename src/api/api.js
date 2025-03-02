import axios from "axios";

const API_URL = "http://localhost:5000";

// Helper function to get auth headers for authenticated requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Category-related API calls
const getCategories = () => axios.get(`${API_URL}/categories/view_category`);
const createCategory = (data) => axios.post(`${API_URL}/categories/create_category`, data, { headers: getAuthHeaders() });
const updateCategory = (id, data) => axios.put(`${API_URL}/categories/update_category/${id}`, data, { headers: getAuthHeaders() });
const deleteCategory = (id) => axios.delete(`${API_URL}/categories/delete_category/${id}`, { headers: getAuthHeaders() });

// Comment-related API calls
const getComments = () => axios.get(`${API_URL}/comments/view_comment`);
const createComment = (data) => axios.post(`${API_URL}/comments/create_comment`, data, { headers: getAuthHeaders() });
const updateComment = (id, data) => axios.put(`${API_URL}/comments/update_comment/${id}`, data, { headers: getAuthHeaders() });
const deleteComment = (id) => axios.delete(`${API_URL}/comments/delete_comment/${id}`, { headers: getAuthHeaders() });

// Pin-related API calls
const getPins = () => axios.get(`${API_URL}/pins/view_pin`, {
  headers: getAuthHeaders()
});

const getUserPins = (userId) => axios.get(`${API_URL}/pins/user/${userId}`, {
  headers: getAuthHeaders()
});

const createPin = (data) => {
  console.log('API: Creating Pin', data);
  return axios.post(`${API_URL}/pins/create_pin`, data, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    }
  });
};

const deletePin = (id) => {
  console.log('API: Attempting to delete pin:', id);
  return axios.delete(`${API_URL}/pins/delete_pin/${id}`, { 
    headers: getAuthHeaders()
  });
};

// Reminder-related API calls
const getReminders = () => axios.get(`${API_URL}/reminders/view_reminder`);
const createReminder = (data) => axios.post(`${API_URL}/reminders/create_reminder`, data, { headers: getAuthHeaders() });
const updateReminder = (id, data) => axios.put(`${API_URL}/reminders/update_reminder/${id}`, data, { headers: getAuthHeaders() });
const deleteReminder = (id) => axios.delete(`${API_URL}/reminders/delete_reminder/${id}`, { headers: getAuthHeaders() });

// Upload-related API calls
const getUploads = () =>
  axios.get(`${API_URL}/uploads/view_uploads`, {
    headers: getAuthHeaders()
  });

const getUserUploads = (userId) =>
  axios.get(`${API_URL}/uploads/user/${userId}`, {
    headers: getAuthHeaders()
  });

const createUpload = (data) =>
  axios.post(`${API_URL}/uploads/create`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeaders()
    },
  });

const getUploadsByCategory = (categoryId) =>
  axios.get(`${API_URL}/uploads/category/${categoryId}`, {
    headers: getAuthHeaders()
  });

const updateUpload = (id, data) => axios.put(`${API_URL}/uploads/update_uploads/${id}`, data, { headers: getAuthHeaders() });
const deleteUpload = (id) => axios.delete(`${API_URL}/uploads/delete_uploads/${id}`, { headers: getAuthHeaders() });

// User-related API calls
const loginUser = (data) => axios.post(`${API_URL}/users/login`, data);
const registerUser = (data) => axios.post(`${API_URL}/users/signup`, data);
const getUsers = () => axios.get(`${API_URL}/users/view_users`, { headers: getAuthHeaders() });
const createUser = (data) => axios.post(`${API_URL}/users/create_users`, data, { headers: getAuthHeaders() });
const updateUser = (id, data) => axios.put(`${API_URL}/users/update_users/${id}`, data, { headers: getAuthHeaders() });
const deleteUser = (id) => axios.delete(`${API_URL}/users/delete_users/${id}`, { headers: getAuthHeaders() });

// Follow-related API calls
const toggleFollow = (userId) =>
  axios.post(`${API_URL}/follows/toggle`, { userId }, {
    headers: getAuthHeaders()
  });

const getFollowersCount = (userId) =>
  axios.get(`${API_URL}/follows/followers-count/${userId}`);

const getFollowingStatus = (userId) =>
  axios.get(`${API_URL}/follows/status/${userId}`, {
    headers: getAuthHeaders()
  });
// Current user info
const getCurrentUser = () => axios.get(`${API_URL}/users/me`, { headers: getAuthHeaders() });

export {
  getCategories, createCategory, updateCategory, deleteCategory,
  getComments, createComment, updateComment, deleteComment,
  getPins, getUserPins, createPin, deletePin,
  getReminders, createReminder, updateReminder, deleteReminder,
  getUploads, getUserUploads, getUploadsByCategory, createUpload, updateUpload, deleteUpload,
  loginUser, registerUser, getUsers, createUser, updateUser, deleteUser,
  getCurrentUser, toggleFollow, getFollowersCount, getFollowingStatus
};