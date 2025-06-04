const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/users/login`,
  REGISTER: `${BASE_URL}/users/register`,
  PRODUCTS: `${BASE_URL}/products/products`,
  ACCOUNT: `${BASE_URL}/users/user`
};