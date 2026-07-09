import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentActivityAction, DocumentStatus } from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { CreateDocumentDto } from './dto/create-document.dto';
import type { ListDocumentsDto } from './dto/list-documents.dto';
import type { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentsRepository } from './documents.repository';
import { DocumentActivitiesService } from './activities/document-activities.service';
import { FoldersRepository } from './folders/folders.repository';
import { DocumentStorageService } from './storage/document-storage.service';
import { FileMetadataService } from './storage/file-metadata.service';
import { FileValidationService } from './storage/file-validation.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly documents: DocumentsRepository,
    private readonly folders: FoldersRepository,
    private readonly activities: DocumentActivitiesService,
    private readonly validation: FileValidationService,
    private readonly metadata: FileMetadataService,
    private readonly storage: DocumentStorageService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string, query: ListDocumentsDto) {
    return this.documents.list(organisationId, query);
  }

  async findOne(organisationId: string, id: string) {
    const document = await this.documents.findById(organisationId, id);
    if (!document) throw new NotFoundException('Document was not found.');
    return document;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateDocumentDto) {
    if (dto.folderId) await this.assertFolder(organisationId, dto.folderId);
    const { extension } = this.validation.validate(dto);
    const fileName = this.metadata.toSafeFileName(dto.originalFileName);
    const storageKey = this.metadata.createStorageKey(organisationId, dto.originalFileName);
    const documentType = this.metadata.inferDocumentType(dto.mimeType, extension);

    const document = await this.documents.create(organisationId, actorUserId, dto, {
      fileName,
      fileExtension: extension,
      storageKey,
      storageBucket: dto.storageBucket ?? 'documents',
      documentType,
    });

    await this.activities.record({
      organisationId,
      documentId: document.id,
      folderId: document.folderId ?? undefined,
      actorId: actorUserId,
      action: DocumentActivityAction.DOCUMENT_UPLOADED,
      metadata: {
        fileName: document.fileName,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
      },
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'document.uploaded',
      entityType: 'document',
      entityId: document.id,
    });
    return document;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateDocumentDto) {
    if (dto.folderId) await this.assertFolder(organisationId, dto.folderId);
    const result = await this.documents.update(organisationId, id, dto);
    if (result.count === 0) throw new NotFoundException('Document was not found.');
    await this.activities.record({
      organisationId,
      documentId: id,
      folderId: dto.folderId ?? undefined,
      actorId: actorUserId,
      action: dto.folderId
        ? DocumentActivityAction.DOCUMENT_MOVED
        : DocumentActivityAction.DOCUMENT_RENAMED,
      metadata: {
        folderId: dto.folderId,
        title: dto.title,
        description: dto.description,
        visibility: dto.visibility,
        isPinned: dto.isPinned,
        isLocked: dto.isLocked,
      },
    });
    return this.findOne(organisationId, id);
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const result = await this.documents.setStatus(
      organisationId,
      id,
      DocumentStatus.DELETED,
      new Date(),
    );
    if (result.count === 0) throw new NotFoundException('Document was not found.');
    await this.activities.record({
      organisationId,
      documentId: id,
      actorId: actorUserId,
      action: DocumentActivityAction.DOCUMENT_DELETED,
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'document.deleted',
      entityType: 'document',
      entityId: id,
    });
    return { success: true };
  }

  async restore(organisationId: string, actorUserId: string, id: string) {
    const result = await this.documents.setStatus(organisationId, id, DocumentStatus.ACTIVE, null);
    if (result.count === 0) throw new NotFoundException('Document was not found.');
    await this.activities.record({
      organisationId,
      documentId: id,
      actorId: actorUserId,
      action: DocumentActivityAction.DOCUMENT_RESTORED,
    });
    return this.findOne(organisationId, id);
  }

  async download(organisationId: string, actorUserId: string, id: string) {
    const document = await this.findOne(organisationId, id);
    const downloadUrl = await this.storage.createDownloadTarget(document.storageKey);
    await this.activities.record({
      organisationId,
      documentId: id,
      actorId: actorUserId,
      action: DocumentActivityAction.DOCUMENT_DOWNLOADED,
    });
    return {
      fileName: document.originalFileName,
      mimeType: document.mimeType,
      fileSize: document.fileSize,
      downloadUrl,
    };
  }

  private async assertFolder(organisationId: string, folderId: string) {
    const folder = await this.folders.findById(organisationId, folderId);
    if (!folder) throw new NotFoundException('Folder was not found.');
  }
}
