import axios from "axios";
import { Currency } from "../types/Currency";

const API_URL = "http://localhost:5105/api/currency";

function getToken() {
  return localStorage.getItem("token");
}

export const getAllCurrencies = () =>
  axios.get<Currency[]>(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).then(res => res.data);

export const getCurrency = (id: number) =>
  axios.get<Currency>(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).then(res => res.data);

export const createCurrency = (currency: Omit<Currency, "id">) =>
  axios.post<Currency>(API_URL, currency, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).then(res => res.data);

export const updateCurrency = (id: number, currency: Currency) =>
  axios.put<Currency>(`${API_URL}/${id}`, currency, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).then(res => res.data);

export const deleteCurrency = (id: number) =>
  axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });