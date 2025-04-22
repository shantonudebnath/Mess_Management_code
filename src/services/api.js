// src/services/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // Replace with your backend URL

export const getTotalUsers = () => axios.get(`${API_BASE}/users/count`);
export const getTotalMeals = () => axios.get(`${API_BASE}/meals/count`);
export const getTotalExpenses = () => axios.get(`${API_BASE}/expenses/total`);
export const getBalance = () => axios.get(`${API_BASE}/report/balance`);
