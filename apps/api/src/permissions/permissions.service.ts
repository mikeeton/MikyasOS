import { Injectable } from '@nestjs/common';
import { OrganisationRoleType } from '@prisma/client';

import { DEFAULT_PERMISSIONS } from '../auth/auth.constants';
import { PrismaService } from '../infra/database/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureDefaults() {
    await Promise.all(
      DEFAULT_PERMISSIONS.map((key) =>
        this.prisma.permission.upsert({
          where: { key },
          update: {},
          create: { key, description: key.replaceAll(':', ' ') },
        }),
      ),
    );
  }

  async userHasPermissions(userId: string, organisationId: string, required: string[]) {
    const member = await this.prisma.organisationMember.findFirst({
      where: { userId, organisationId, deletedAt: null },
      include: {
        role: {
          include: {
            rolePermissions: { include: { permission: true } },
          },
        },
      },
    });

    if (!member) {
      return false;
    }

    const granted = new Set(member.role.rolePermissions.map(({ permission }) => permission.key));

    if (
      this.shouldBackfillDefaults(member.role.type, member.role.isSystem) &&
      required.some((permission) => !granted.has(permission))
    ) {
      await this.ensureDefaults();
      await this.ensureRoleHasDefaultPermissions(member.role.id);
      DEFAULT_PERMISSIONS.forEach((permission) => granted.add(permission));
    }

    return required.every((permission) => granted.has(permission));
  }

  private shouldBackfillDefaults(roleType: OrganisationRoleType, isSystem: boolean) {
    return (
      isSystem &&
      (roleType === OrganisationRoleType.OWNER ||
        roleType === OrganisationRoleType.ADMIN ||
        roleType === OrganisationRoleType.MEMBER)
    );
  }

  private async ensureRoleHasDefaultPermissions(roleId: string) {
    const permissions = await this.prisma.permission.findMany({
      where: { key: { in: [...DEFAULT_PERMISSIONS] } },
      select: { id: true },
    });

    await this.prisma.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });
  }
}
