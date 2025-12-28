import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CSRF cookie'leri için gerekli
});

// CSRF token'ı saklamak için
let csrfToken = null;

// CSRF token'ı almak için fonksiyon
export const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/csrf-token');
    csrfToken = response.data.token;
    return csrfToken;
  } catch (error) {
    console.error('CSRF token alınamadı:', error);
    return null;
  }
};

// Request interceptor - Token ve CSRF token ekle
api.interceptors.request.use(async (config) => {
  // Authorization token ekle
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // POST, PUT, DELETE isteklerine CSRF token ekle
  if (['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())) {
    // Eğer CSRF token yoksa, al
    if (!csrfToken) {
      await fetchCsrfToken();
    }
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // CSRF token hatası durumunda yeni token al ve tekrar dene
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF') && !originalRequest._retry) {
      originalRequest._retry = true;
      await fetchCsrfToken();
      if (csrfToken) {
        originalRequest.headers['x-csrf-token'] = csrfToken;
      }
      return api(originalRequest);
    }

    // 401 durumunda logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
