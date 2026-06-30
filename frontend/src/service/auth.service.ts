const API_URL = import.meta.env.VITE_API_URL;

export const getEntraLoginUrl = () => `${API_URL}/auth/entra/login`;