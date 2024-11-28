import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/ride",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const errorDescription = error.response?.data?.error_description || "Erro desconhecido.";

    return Promise.reject({
      message: errorDescription,
      status: error.response?.status || 500,
      originalError: error,
    });
  }
);

export default api;