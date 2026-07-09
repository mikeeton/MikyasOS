import { Injectable } from '@nestjs/common';
import type { DocumentActivityAction, Prisma } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';

export interface RecordDocumentActivityInput {
  organisationId: string;
  documentId?: string;
  folderId?: string;
  actorId?: string;
  action: DocumentActivityAction;
  metadata?: Prisma.InputJsonValue;
}

@Injectable()
export class DocumentActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: RecordDocumentActivityInput) {
    return this.prisma.documentActivity.create({
      data: {
        organisationId: input.organisationId,
        documentId: input.documentId,
        folderId: input.folderId,
        actorId: input.actorId,
        action: input.action,
        metadata: input.metadata,
      },
    });
  }

  listForDocument(organisationId: string, documentId: string) {
    return this.prisma.documentActivity.findMany({
      where: { organisationId, documentId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { actor: { select: { id: true, name: true, email: true } } },
    });
  }
}
