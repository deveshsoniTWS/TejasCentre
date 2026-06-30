import { prisma } from "../lib/prisma";
import * as bcrypt from 'bcrypt';

async function init() {
  try {
    console.log("🚀 Initializing database...\n");

    // =====================================================
    // Roles
    // =====================================================

    const roleNames = ["SuperAdmin", "Admin", "User"];

    const roles = new Map<string, string>();

    for (const role of roleNames) {
      const created = await prisma.role.upsert({
        where: { name: role },
        update: {},
        create: {
          name: role,
          createdBy: "system",
        },
      });

      roles.set(role, created.id);
    }

    console.log("✅ Roles created");

    // =====================================================
    // Permissions
    // =====================================================

    const permissions = [
      // Users
      "user.create",
      "user.read",
      "user.update",
      "user.delete",

      // Areas (Plants)
      "area.create",
      "area.read",
      "area.update",
      "area.delete",

      // Locations
      "location.create",
      "location.read",
      "location.update",
      "location.delete",

      // Roles
      "role.create",
      "role.read",
      "role.update",
      "role.delete",

      // Permissions
      "permission.create",
      "permission.read",
      "permission.update",
      "permission.delete",

      // System
      "system.configure",
    ];

    const permissionMap = new Map<string, string>();

    for (const permission of permissions) {
      const created = await prisma.permission.upsert({
        where: { name: permission },
        update: {},
        create: {
          name: permission,
          createdBy: "system",
        },
      });

      permissionMap.set(permission, created.id);
    }

    console.log(`✅ ${permissions.length} permissions created`);

    // =====================================================
    // SuperAdmin gets everything
    // =====================================================

    for (const permissionId of permissionMap.values()) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roles.get("SuperAdmin")!,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId: roles.get("SuperAdmin")!,
          permissionId,
          createdBy: "system",
        },
      });
    }

    // =====================================================
    // Admin permissions
    // =====================================================

    const adminPermissions = permissions.filter(
      (p) => !p.startsWith("permission.") && p !== "system.configure"
    );

    for (const permission of adminPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roles.get("Admin")!,
            permissionId: permissionMap.get(permission)!,
          },
        },
        update: {},
        create: {
          roleId: roles.get("Admin")!,
          permissionId: permissionMap.get(permission)!,
          createdBy: "system",
        },
      });
    }

    // =====================================================
    // User permissions
    // =====================================================

    const userPermissions = [
      "user.read",
      "area.read",
      "location.read",
    ];

    for (const permission of userPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roles.get("User")!,
            permissionId: permissionMap.get(permission)!,
          },
        },
        update: {},
        create: {
          roleId: roles.get("User")!,
          permissionId: permissionMap.get(permission)!,
          createdBy: "system",
        },
      });
    }

    console.log("✅ Role permissions assigned");

    // =====================================================
    // Super Admin User
    // =====================================================

    const passwordHash = await bcrypt.hash("adminPassword", 10);

    const admin = await prisma.user.upsert({
      where: {
        userName: "admin@admin.com",
      },
      update: {
        passwordHash,
      },
      create: {
        userName: "admin@admin.com",
        name: "Super Administrator",
        designation: "Super Admin",
        passwordHash,
        createdBy: "system",
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: admin.id,
          roleId: roles.get("SuperAdmin")!,
        },
      },
      update: {},
      create: {
        userId: admin.id,
        roleId: roles.get("SuperAdmin")!,
        createdBy: "system",
      },
    });

    console.log("✅ Super admin created");

    // =====================================================
    // Locations
    // =====================================================

    const locations = [
      "Vijayanagar",
      "Raigarh",
      "Salem",
      "Sambalpur",
    ];

    const locationMap = new Map<string, string>();

    for (const location of locations) {
      const created = await prisma.location.upsert({
        where: {
          name: location,
        },
        update: {},
        create: {
          name: location,
          businessUnit: "JSW Steel",
          country: "India",
          createdBy: "system",
        },
      });

      locationMap.set(location, created.id);
    }

    console.log("✅ Locations seeded");

    // =====================================================
    // Plants (Areas)
    // =====================================================

    const plants = [
      {
        name: "Vijayanagar - Sinter Plant",
        location: "Vijayanagar",
      },
      {
        name: "Vijayanagar - Pellet Plant",
        location: "Vijayanagar",
      },
      {
        name: "Raigarh - Pellet Plant",
        location: "Raigarh",
      },
      {
        name: "BPSL - Pellet Plant",
        location: "Sambalpur",
      },
      {
        name: "Coke Oven Monitoring",
        location: "Vijayanagar",
      },
      {
        name: "Pipe Conveyor (RMHS)",
        location: "Vijayanagar",
      },
      {
        name: "Material Analysis (RMHS)",
        location: "Vijayanagar",
      },
    ];

    for (const plant of plants) {
      const createdPlant = await prisma.plant.upsert({
        where: {
          name: plant.name,
        },
        update: {},
        create: {
          name: plant.name,
          createdBy: "system",
        },
      });

      await prisma.plantLocation.upsert({
        where: {
          plantId_locationId: {
            plantId: createdPlant.id,
            locationId: locationMap.get(plant.location)!,
          },
        },
        update: {},
        create: {
          plantId: createdPlant.id,
          locationId: locationMap.get(plant.location)!,
          createdBy: "system",
        },
      });
    }

    console.log("✅ Plants seeded");

    console.log("\n═══════════════════════════════════════");
    console.log("Initialization Complete");
    console.log("═══════════════════════════════════════");
    console.log("Username : admin@admin.com");
    console.log("Password : adminPassword");
    console.log("Role     : SuperAdmin");
    console.log("═══════════════════════════════════════");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

init();