import axios from "axios";
import { useAuthStore } from "../store/Auth.js";

const axiosInstance = axios.create({

  baseURL: 'https://numerologiamongobd-1.onrender.com/api',
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

   
    if (token) {
      config.headers["x-token"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 503 && error.response.data?.mantenimiento) {
      const authStore = useAuthStore();
      if (authStore.usuario?.rol !== 'ADMIN') {
        window.location.hash = '/mantenimiento';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;