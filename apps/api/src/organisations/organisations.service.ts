import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganisationRoleType } from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { DEFAULT_PERMISSIONS } from '../auth/auth.constants';
import { PrismaService } from '../infra/database/prisma.service';
import { PermissionsService } from '../permissions/permissions.service';
import type { CreateOrganisationDto } from './dto/create-organisation.dto';

@Injectable()
export class OrganisationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
    private readonly permissions: PermissionsService,
  ) {}

  async create(userId: string, dto: CreateOrganisationDto) {
    await this.permissions.ensureDefaults();
    const slug = await this.createUniqueSlug(dto.name);

    const organisation = await this.prisma.$transaction(async (tx) => {
      const created = await tx.organisation.create({
        data: {
          name: dto.name,
          slug,
          industry: dto.industry,
          companySize: dto.companySize,
          country: dto.country,
          timezone: dto.timezone,
          currency: dto.currency,
          ownerId: userId,
        },
      });

      const ownerRole = await tx.role.create({
        data: {
          organisationId: created.id,
          name: 'Owner',
          type: OrganisationRoleType.OWNER,
          isSystem: true,
        },
      });

      await tx.role.createMany({
        data: [
          {
            organisationId: created.id,
            name: 'Admin',
            type: OrganisationRoleType.ADMIN,
            isSystem: true,
          },
          {
            organisationId: created.id,
            name: 'Member',
            type: OrganisationRoleType.MEMBER,
            isSystem: true,
          },
        ],
      });

      const permissions = await tx.permission.findMany({
        where: { key: { in: [...DEFAULT_PERMISSIONS] } },
      });

      await tx.rolePermission.createMany({
        data: permissions.map((permission) => ({
          roleId: ownerRole.id,
          permissionId: permission.id,
        })),
      });

      await tx.organisationMember.create({
        data: {
          organisationId: created.id,
          userId,
          roleId: ownerRole.id,
          roleType: OrganisationRoleType.OWNER,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { activeOrganisationId: created.id },
      });

      return created;
    });

    await this.auditLogs.record({
      organisationId: organisation.id,
      actorUserId: userId,
      action: 'organisation.created',
      entityType: 'organisation',
      entityId: organisation.id,
    });

    return organisation;
  }

  listForUser(userId: string) {
    return this.prisma.organisation.findMany({
      where: {
        deletedAt: null,
        members: { some: { userId, deletedAt: null } },
      },
      include: {
        members: {
          where: { userId, deletedAt: null },
          include: { role: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async assertMembership(userId: string, organisationId: string) {
    const membership = await this.prisma.organisationMember.findFirst({
      where: { userId, organisationId, deletedAt: null, organisation: { deletedAt: null } },
    });

    if (!membership) {
      throw new NotFoundException('Organisation was not found.');
    }

    return membership;
  }

  async switchActive(userId: string, organisationId: string) {
    await this.assertMembership(userId, organisationId);

    return this.prisma.user.update({
      where: { id: userId },
      data: { activeOrganisationId: organisationId },
      select: { id: true, email: true, name: true, activeOrganisationId: true },
    });
  }

  private async createUniqueSlug(name: string) {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 48);
    let slug = base || 'organisation';
    let counter = 1;

    while (await this.prisma.organisation.findUnique({ where: { slug } })) {
      counter += 1;
      slug = `${base}-${counter}`;
    }

    return slug;
  }
}
