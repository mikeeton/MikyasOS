import { Injectable } from '@nestjs/common';

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
    return required.every((permission) => granted.has(permission));
  }
}
