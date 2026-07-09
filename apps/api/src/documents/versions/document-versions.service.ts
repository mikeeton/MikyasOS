import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentActivityAction } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import type { UploadDocumentVersionDto } from '../dto/upload-document-version.dto';
import { DocumentActivitiesService } from '../activities/document-activities.service';
import { DocumentsService } from '../documents.service';
import { FileMetadataService } from '../storage/file-metadata.service';
import { FileValidationService } from '../storage/file-validation.service';

@Injectable()
export class DocumentVersionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documents: DocumentsService,
    private readonly activities: DocumentActivitiesService,
    private readonly validation: FileValidationService,
    private readonly metadata: FileMetadataService,
  ) {}

  list(organisationId: string, documentId: string) {
    return this.prisma.documentVersion.findMany({
      where: { organisationId, documentId },
      orderBy: { versionNumber: 'desc' },
      include: { uploadedBy: { select: { id: true, name: true, email: true } } },
    });
  }

  async upload(
    organisationId: string,
    actorUserId: string,
    documentId: string,
    dto: UploadDocumentVersionDto,
  ) {
    await this.documents.findOne(organisationId, documentId);
    const { extension } = this.validation.validate(dto);
    const fileName = this.metadata.toSafeFileName(dto.originalFileName);
    const storageKey = this.metadata.createStorageKey(organisationId, dto.originalFileName);

    const version = await this.prisma.$transaction(async (tx) => {
      const latest = await tx.documentVersion.findFirst({
        where: { organisationId, documentId },
        orderBy: { versionNumber: 'desc' },
      });
      const nextVersionNumber = (latest?.versionNumber ?? 0) + 1;
      const created = await tx.documentVersion.create({
        data: {
          organisationId,
          documentId,
          versionNumber: nextVersionNumber,
          fileName,
          storageKey,
          mimeType: dto.mimeType,
          fileSize: dto.fileSize,
          checksum: dto.checksum,
          uploadedById: actorUserId,
          changeNote: dto.changeNote,
        },
      });
      await tx.document.update({
        where: { id: documentId },
        data: {
          currentVersionId: created.id,
          fileName,
          originalFileName: dto.originalFileName,
          mimeType: dto.mimeType,
          fileExtension: extension,
          fileSize: dto.fileSize,
          storageKey,
          checksum: dto.checksum,
        },
      });
      return created;
    });

    await this.activities.record({
      organisationId,
      documentId,
      actorId: actorUserId,
      action: DocumentActivityAction.VERSION_UPLOADED,
      metadata: { versionNumber: version.versionNumber },
    });
    return version;
  }

  async restore(
    organisationId: string,
    actorUserId: string,
    documentId: string,
    versionId: string,
  ) {
    const version = await this.prisma.documentVersion.findFirst({
      where: { id: versionId, organisationId, documentId },
    });
    if (!version) throw new NotFoundException('Document version was not found.');
    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        currentVersionId: version.id,
        fileName: version.fileName,
        mimeType: version.mimeType,
        fileSize: version.fileSize,
        storageKey: version.storageKey,
        checksum: version.checksum,
      },
    });
    await this.activities.record({
      organisationId,
      documentId,
      actorId: actorUserId,
      action: DocumentActivityAction.VERSION_RESTORED,
      metadata: { versionNumber: version.versionNumber },
    });
    return this.documents.findOne(organisationId, documentId);
  }
}
