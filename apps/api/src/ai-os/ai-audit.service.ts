import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class AiAuditService {
  constructor(private readonly auditLogs: AuditLogsService) {}

  recordRequest(input: {
    organisationId: string;
    userId: string;
    action: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.auditLogs.record({
      organisationId: input.organisationId,
      actorUserId: input.userId,
      action: input.action,
      entityType: 'AI',
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    });
  }
}
