import { LocationRepository } from "./location.repository";
import { parsePagination, paginate, PaginatedResponse } from "../../lib/pagination";
import { LocationItem } from "./location.types";
import { successResponse } from "../../utils/ErrorSuccessResponse";
import { StatusMessages } from "../../constants/constants";
import { SuccessResponseType } from "../../utils/types";

export class LocationService {
  private locationRepository: LocationRepository;

  constructor() {
    this.locationRepository = new LocationRepository();
  }

  async getLocations(query: Record<string, any>): Promise<SuccessResponseType<PaginatedResponse<LocationItem>>> {
    const pagination = parsePagination(query);
    const { data, total } = await this.locationRepository.findMany(pagination, query.name, query.plantId);
    return successResponse(StatusMessages.SUCCESS,paginate(data as LocationItem[], total, pagination));
  }
}