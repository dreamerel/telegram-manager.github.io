import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const accountsApi = {
  // Получение списка всех аккаунтов
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/accounts`);
    return response.data;
  },

  // Добавление нового аккаунта
  add: async (accountData) => {
    const response = await axios.post(`${BASE_URL}/accounts/add`, accountData);
    return response.data;
  },

  // Верификация аккаунта с кодом подтверждения
  verify: async (verificationData) => {
    const response = await axios.post(`${BASE_URL}/accounts/verify`, verificationData);
    return response.data;
  },

  // Удаление аккаунта
  delete: async (accountId) => {
    const response = await axios.delete(`${BASE_URL}/accounts/${accountId}`);
    return response.data;
  },

  // Обновление статуса аккаунта
  updateStatus: async (accountId, isActive) => {
    const response = await axios.patch(`${BASE_URL}/accounts/${accountId}/status`, { isActive });
    return response.data;
  }
};