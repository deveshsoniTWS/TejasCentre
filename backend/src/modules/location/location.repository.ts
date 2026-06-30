import { prisma } from "../../lib/prisma";
import { PaginationQuery } from "../../lib/pagination";

export class LocationRepository {
  async findMany({ skip, limit }: PaginationQuery, name?: string, plantId?: string) {
    const where = {
      deletedAt: null,
      ...(name && { name: { contains: name, mode: "insensitive" as const } }),
      ...(plantId && {
        plantLocations: {
          some: {
            plantId,
            deletedAt: null,
          },
        },
      }),
    };
    const [data, total] = await prisma.$transaction([
      prisma.location.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, name: true, description: true, image: true },
      }),
      prisma.location.count({ where }),
    ]);
    return { data, total };
  }
}