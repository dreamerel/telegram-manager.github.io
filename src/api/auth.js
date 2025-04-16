import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const authApi = {
  // Регистрация нового пользователя
  register: async (userData) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data;
  },

  // Авторизация пользователя
  login: async (credentials) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  // Выход пользователя
  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  // Проверка токена и получение данных пользователя
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${BASE_URL}/auth/me`);
      return response.data;
    }
    return null;
  }
};