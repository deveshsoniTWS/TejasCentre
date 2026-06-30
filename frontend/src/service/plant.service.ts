const API_URL = import.meta.env.VITE_API_URL;

type GetPlantsParams = {
  page?: number;
  limit?: number;
  name?: string;
  locationId?: string;
};

const getPlants = async ({
  page = 1,
  limit = 100,
  name = '',
  locationId,
}: GetPlantsParams = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(name && { name }),
      ...(locationId && { locationId }),
    });
    const res = await fetch(`${API_URL}/plants?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch plants');
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { getPlants };
