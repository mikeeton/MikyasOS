import { Injectable } from '@nestjs/common';

import { PrismaService } from '../infra/database/prisma.service';

@Injectable()
export class AiMemoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getMemoryOverview(organisationId: string, userId: string) {
    const [recentAuditLogs, documentCount, projectCount, companyCount] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: { organisationId },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { id: true, action: true, entityType: true, entityId: true, createdAt: true },
      }),
      this.prisma.document.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.project.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.company.count({ where: { organisationId, deletedAt: null } }),
    ]);

    return {
      conversationMemory: {
        enabled: true,
        currentUserScoped: true,
        userId,
        retentionPolicy: 'prepared',
      },
      businessMemory: {
        enabled: true,
        organisationScoped: true,
        documentCount,
        projectCount,
        companyCount,
      },
      preferences: [],
      importantFacts: [],
      pinnedMemories: [],
      recentActions: recentAuditLogs,
      episodicMemoryPrepared: true,
    };
  }
}
