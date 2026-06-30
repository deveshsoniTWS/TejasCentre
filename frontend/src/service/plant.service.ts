import { api } from "../utils/api"

type GetPlantsParams = {
  page?: number;
  limit?: number;
  name?: string;
  locationId?: string;
};

const getPlants = async ({
  page = 1,
  limit = 100,
  name = "",
  locationId,
}: GetPlantsParams = {}) => {
  const { data } = await api.get("/plants", {
    params: {
      page,
      limit,
      name: name || undefined,
      locationId,
    },
  });

  return data;
};

export { getPlants };