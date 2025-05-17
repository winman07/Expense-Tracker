import axios from 'axios';
import config from '../config';
import { getToken } from './auth';
import { useMockData } from '../config';

const createApiClient = async () => {
  const token = await getToken();
  
  return axios.create({
    baseURL: config.apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  });
};

export const getExpenses = async () => {
  // For mock mode
  if (useMockData) {
    return Promise.resolve(window.mockExpenses || []);
  }

  // Real implementation for AWS
  const api = await createApiClient();
  const response = await api.get('/expenses');
  return response.data;
};

export const getExpense = async (id) => {
  // For mock mode
  if (useMockData) {
    const expense = window.mockExpenses.find(e => e.expenseId === id);
    return Promise.resolve(expense || null);
  }

  // Real implementation for AWS
  const api = await createApiClient();
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

export const createExpense = async (expenseData) => {
  // For mock mode
  if (useMockData) {
    const newExpense = {
      expenseId: Date.now().toString(),
      userId: 'mock-user-id',
      ...expenseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!window.mockExpenses) {
      window.mockExpenses = [];
    }
    
    window.mockExpenses.push(newExpense);
    return Promise.resolve(newExpense);
  }

  // Real implementation for AWS
  const api = await createApiClient();
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  // For mock mode
  if (useMockData) {
    const index = window.mockExpenses.findIndex(e => e.expenseId === id);
    
    if (index !== -1) {
      const updatedExpense = {
        ...window.mockExpenses[index],
        ...expenseData,
        updatedAt: new Date().toISOString()
      };
      
      window.mockExpenses[index] = updatedExpense;
      return Promise.resolve(updatedExpense);
    }
    
    return Promise.reject(new Error('Expense not found'));
  }

  // Real implementation for AWS
  const api = await createApiClient();
  const response = await api.put(`/expenses/${id}`, expenseData);
  return response.data;
};

export const deleteExpense = async (id) => {
  // For mock mode
  if (useMockData) {
    window.mockExpenses = window.mockExpenses.filter(e => e.expenseId !== id);
    return Promise.resolve(true);
  }

  // Real implementation for AWS
  const api = await createApiClient();
  await api.delete(`/expenses/${id}`);
  return true;
};