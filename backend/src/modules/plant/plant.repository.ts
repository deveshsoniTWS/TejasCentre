import { prisma } from "../../lib/prisma";
import { PaginationQuery } from "../../lib/pagination";

export class PlantRepository {
  async findMany({ skip, limit }: PaginationQuery, name?: string, locationId?: string) {
    const where = {
      deletedAt: null,
      ...(name && { name: { contains: name, mode: "insensitive" as const } }),
      ...(locationId && {
        plantLocations: {
          some: {
            locationId,
            deletedAt: null,
                }
              }
            })
    };
    const [data, total] = await prisma.$transaction([
      prisma.plant.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, name: true, description: true, image: true },
      }),
      prisma.plant.count({ where }),
    ]);
    return { data, total };
  }
}