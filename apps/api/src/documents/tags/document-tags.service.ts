import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentActivityAction } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { DocumentActivitiesService } from '../activities/document-activities.service';
import type { CreateDocumentTagDto } from '../dto/create-document-tag.dto';

@Injectable()
export class DocumentTagsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activities: DocumentActivitiesService,
  ) {}

  list(organisationId: string) {
    return this.prisma.documentTag.findMany({
      where: { organisationId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  create(organisationId: string, dto: CreateDocumentTagDto) {
    return this.prisma.documentTag.create({
      data: { organisationId, name: dto.name, colour: dto.colour, description: dto.description },
    });
  }

  async remove(organisationId: string, id: string) {
    const result = await this.prisma.documentTag.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (result.count === 0) throw new NotFoundException('Document tag was not found.');
    return { success: true };
  }

  async assign(organisationId: string, actorUserId: string, documentId: string, tagId: string) {
    const assignment = await this.prisma.documentTagAssignment.create({
      data: { organisationId, documentId, tagId },
    });
    await this.activities.record({
      organisationId,
      documentId,
      actorId: actorUserId,
      action: DocumentActivityAction.TAG_ADDED,
      metadata: { tagId },
    });
    return assignment;
  }

  async unassign(organisationId: string, actorUserId: string, documentId: string, tagId: string) {
    await this.prisma.documentTagAssignment.deleteMany({
      where: { organisationId, documentId, tagId },
    });
    await this.activities.record({
      organisationId,
      documentId,
      actorId: actorUserId,
      action: DocumentActivityAction.TAG_REMOVED,
      metadata: { tagId },
    });
    return { success: true };
  }
}
