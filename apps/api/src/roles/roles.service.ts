import { Injectable, NotFoundException } from '@nestjs/common';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string) {
    return this.prisma.role.findMany({
      where: { organisationId, deletedAt: null },
      include: { rolePermissions: { include: { permission: true } } },
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
    });
  }

  async assign(organisationId: string, actorUserId: string, dto: AssignRoleDto) {
    const role = await this.prisma.role.findFirst({
      where: { id: dto.roleId, organisationId, deletedAt: null },
    });

    if (!role) {
      throw new NotFoundException('Role was not found.');
    }

    const member = await this.prisma.organisationMember.update({
      where: {
        organisationId_userId: {
          organisationId,
          userId: dto.userId,
        },
      },
      data: {
        roleId: role.id,
        roleType: role.type,
      },
    });

    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'role.assigned',
      entityType: 'organisationMember',
      entityId: member.id,
      metadata: { userId: dto.userId, roleId: dto.roleId },
    });

    return member;
  }
}
