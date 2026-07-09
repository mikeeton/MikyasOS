import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentActivityAction, DocumentLinkEntityType } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { DocumentActivitiesService } from '../activities/document-activities.service';
import type { CreateDocumentLinkDto } from '../dto/create-document-link.dto';

@Injectable()
export class DocumentLinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activities: DocumentActivitiesService,
  ) {}

  async create(
    organisationId: string,
    actorUserId: string,
    documentId: string,
    dto: CreateDocumentLinkDto,
  ) {
    await this.assertLinkedEntity(organisationId, dto.entityType, dto.entityId);
    const link = await this.prisma.documentLink.create({
      data: { organisationId, documentId, entityType: dto.entityType, entityId: dto.entityId },
    });
    await this.activities.record({
      organisationId,
      documentId,
      actorId: actorUserId,
      action: DocumentActivityAction.DOCUMENT_LINKED,
      metadata: { entityType: dto.entityType, entityId: dto.entityId },
    });
    return link;
  }

  async remove(organisationId: string, actorUserId: string, documentId: string, linkId: string) {
    const deleted = await this.prisma.documentLink.deleteMany({
      where: { id: linkId, organisationId, documentId },
    });
    if (deleted.count === 0) throw new NotFoundException('Document link was not found.');
    await this.activities.record({
      organisationId,
      documentId,
      actorId: actorUserId,
      action: DocumentActivityAction.DOCUMENT_UNLINKED,
      metadata: { linkId },
    });
    return { success: true };
  }

  private async assertLinkedEntity(
    organisationId: string,
    entityType: DocumentLinkEntityType,
    entityId: string,
  ) {
    const exists = await this.findEntity(organisationId, entityType, entityId);
    if (!exists) throw new NotFoundException('Linked record was not found.');
  }

  private findEntity(organisationId: string, entityType: DocumentLinkEntityType, entityId: string) {
    switch (entityType) {
      case DocumentLinkEntityType.COMPANY:
        return this.prisma.company.findFirst({
          where: { id: entityId, organisationId, deletedAt: null },
        });
      case DocumentLinkEntityType.CONTACT:
        return this.prisma.contact.findFirst({
          where: { id: entityId, organisationId, deletedAt: null },
        });
      case DocumentLinkEntityType.PROJECT:
        return this.prisma.project.findFirst({
          where: { id: entityId, organisationId, deletedAt: null },
        });
      case DocumentLinkEntityType.TASK:
        return this.prisma.task.findFirst({
          where: { id: entityId, organisationId, deletedAt: null },
        });
      default:
        throw new NotFoundException('This linked record type is prepared for a future module.');
    }
  }
}
