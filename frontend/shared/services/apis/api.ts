import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5294/api', // ajuste se necessário
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;