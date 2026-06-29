const API_URL = import.meta.env.VITE_API_URL;

export const getEntraLoginUrl = () => `${API_URL}/auth/entra/login`;

export const exchangeEntraCode = async (code: string) => {
  const res = await fetch(
    `${API_URL}/auth/entra/callback?code=${encodeURIComponent(code)}`,
    { method: 'GET' }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Entra login failed');
  }

  return data;
};
