import { api } from "../utils/api";

type GetLocationsParams = {
  page?: number;
  limit?: number;
  name?: string;
  plantId?: string;
};

const getLocations = async ({
  page = 1,
  limit = 100,
  name = "",
  plantId,
}: GetLocationsParams = {}) => {
  const { data } = await api.get("/locations", {
    params: {
      page,
      limit,
      name: name || undefined,
      plantId,
    },
  });

  return data;
};

export { getLocations };