import { prisma } from "../../lib/prisma";
import { User } from "@prisma/client";

export class AuthRepository {
    async findActiveUserByUsername(
        userName: string
    ): Promise<User | null> {
        return prisma.user.findFirst({
            where: {
                userName,
                deletedAt: null,
            },
        });
    }

    async findUserWithPermissions(id: string): Promise<{
        id: string;
        userName: string;
        roles: string[];
        permissions: string[];
    } | null> {
        const user = await prisma.user.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            select: {
                id: true,
                userName: true,
                userRoles: {
                    where: {
                        deletedAt: null,
                    },
                    select: {
                        role: {
                            select: {
                                name: true,
                                rolePermissions: {
                                    where: {
                                        deletedAt: null,
                                    },
                                    select: {
                                        permission: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return null;
        }

        const roles = user.userRoles.map((ur) => ur.role.name);

        const permissions = [
            ...new Set(
                user.userRoles.flatMap((ur) =>
                    ur.role.rolePermissions.map(
                        (rp) => rp.permission.name
                    )
                )
            ),
        ];

        return {
            id: user.id,
            userName: user.userName,
            roles,
            permissions,
        };
    }
}