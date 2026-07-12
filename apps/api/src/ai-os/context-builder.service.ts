import { Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { PrismaService } from '../infra/database/prisma.service';

@Injectable()
export class ContextBuilderService {
  constructor(private readonly prisma: PrismaService) {}

  async build(input: {
    organisationId: string;
    user: AuthenticatedUser;
    currentPage?: string;
    selectedEntity?: { type: string; id: string };
  }) {
    const [organisation, membership, recentProjects, recentDocuments, recentActivity] =
      await Promise.all([
        this.prisma.organisation.findFirst({
          where: { id: input.organisationId, deletedAt: null },
          select: { id: true, name: true, industry: true, companySize: true, country: true },
        }),
        this.prisma.organisationMember.findFirst({
          where: { organisationId: input.organisationId, userId: input.user.id, deletedAt: null },
          include: { role: { select: { name: true, type: true } } },
        }),
        this.prisma.project.findMany({
          where: { organisationId: input.organisationId, deletedAt: null },
          orderBy: { updatedAt: 'desc' },
          take: 5,
          select: { id: true, name: true, status: true, priority: true, dueDate: true },
        }),
        this.prisma.document.findMany({
          where: { organisationId: input.organisationId, deletedAt: null },
          orderBy: { updatedAt: 'desc' },
          take: 5,
          select: { id: true, title: true, documentType: true, visibility: true, updatedAt: true },
        }),
        this.prisma.auditLog.findMany({
          where: { organisationId: input.organisationId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, action: true, entityType: true, entityId: true, createdAt: true },
        }),
      ]);

    return {
      organisation,
      currentUser: { id: input.user.id, email: input.user.email },
      role: membership?.role ?? null,
      permissions: {
        appliedByGuards: true,
        minimumPermission: 'AI.Use',
      },
      currentPage: input.currentPage ?? null,
      selectedEntity: input.selectedEntity ?? null,
      recentProjects,
      recentDocuments,
      recentActivity,
      excludedData: ['finance', 'calendar', 'meetings'],
    };
  }
}
