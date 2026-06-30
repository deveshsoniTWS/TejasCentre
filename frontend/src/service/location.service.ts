const API_URL = import.meta.env.VITE_API_URL;

type GetLocationsParams = {
  page?: number;
  limit?: number;
  name?: string;
  plantId?: string;
};

const getLocations = async ({
  page = 1,
  limit = 100,
  name = '',
  plantId,
}: GetLocationsParams = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(name && { name }),
      ...(plantId && { plantId }),
    });
    const res = await fetch(`${API_URL}/locations?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch locations');
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { getLocations };
