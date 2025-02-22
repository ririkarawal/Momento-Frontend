import axios from 'axios';

const API_URL = 'http://localhost:8092';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const getCategories = () => axios.get(`${API_URL}/view_category`);
const createCategory = (data) => axios.post(`${API_URL}/create_category`, data, { headers: getAuthHeaders() });
const updateCategory = (id, data) => axios.put(`${API_URL}/update_category/${id}`, data, { headers: getAuthHeaders() });
const deleteCategory = (id) => axios.delete(`${API_URL}/delete_category/${id}`, { headers: getAuthHeaders() });

const getComments = () => axios.get(`${API_URL}/view_comment`);
const createComment = (data) => axios.post(`${API_URL}/create_comment`, data, { headers: getAuthHeaders() });
const updateComment = (id, data) => axios.put(`${API_URL}/update_comment/${id}`, data, { headers: getAuthHeaders() });
const deleteComment = (id) => axios.delete(`${API_URL}/delete_comment/${id}`, { headers: getAuthHeaders() });

const getPins = () => axios.get(`${API_URL}/view_pin`);
const createPin = (data) => axios.post(`${API_URL}/create_pin`, data, { headers: getAuthHeaders() });
const updatePin = (id, data) => axios.put(`${API_URL}/update_pin/${id}`, data, { headers: getAuthHeaders() });
const deletePin = (id) => axios.delete(`${API_URL}/delete_pin/${id}`, { headers: getAuthHeaders() });

const getReminders = () => axios.get(`${API_URL}/view_reminder`);
const createReminder = (data) => axios.post(`${API_URL}/create_reminder`, data, { headers: getAuthHeaders() });
const updateReminder = (id, data) => axios.put(`${API_URL}/update_reminder/${id}`, data, { headers: getAuthHeaders() });
const deleteReminder = (id) => axios.delete(`${API_URL}/delete_reminder/${id}`, { headers: getAuthHeaders() });

const getUploads = () => axios.get(`${API_URL}/view_uploads`);
const createUpload = (data) => axios.post(`${API_URL}/create_uploads`, data, { headers: getAuthHeaders() });
const updateUpload = (id, data) => axios.put(`${API_URL}/update_uploads/${id}`, data, { headers: getAuthHeaders() });
const deleteUpload = (id) => axios.delete(`${API_URL}/delete_uploads/${id}`, { headers: getAuthHeaders() });

const loginUser = (data) => axios.post(`${API_URL}/users/login`, data);
const registerUser = (data) => axios.post(`${API_URL}/users/signup`, data);
const getUsers = () => axios.get(`${API_URL}/view_users`, { headers: getAuthHeaders() });
const createUser = (data) => axios.post(`${API_URL}/create_users`, data, { headers: getAuthHeaders() });
const updateUser = (id, data) => axios.put(`${API_URL}/update_users/${id}`, data, { headers: getAuthHeaders() });
const deleteUser = (id) => axios.delete(`${API_URL}/delete_users/${id}`, { headers: getAuthHeaders() });

/** ✅ Added function to get the logged-in user's profile */
const getCurrentUser = () => axios.get(`${API_URL}/users/me`, { headers: getAuthHeaders() });

export {
    getCategories, createCategory, updateCategory, deleteCategory,
    getComments, createComment, updateComment, deleteComment,
    getPins, createPin, updatePin, deletePin,
    getReminders, createReminder, updateReminder, deleteReminder,
    getUploads, createUpload, updateUpload, deleteUpload,
    loginUser, registerUser, getUsers, createUser, updateUser, deleteUser,
    getCurrentUser // ✅ Ensure this is exported
};
