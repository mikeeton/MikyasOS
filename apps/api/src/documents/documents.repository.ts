import { Injectable } from '@nestjs/common';
import type { DocumentStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../infra/database/prisma.service';
import { getDocumentPagination, toDocumentPaginatedResult } from './document-pagination';
import type { CreateDocumentDto } from './dto/create-document.dto';
import type { ListDocumentsDto } from './dto/list-documents.dto';
import type { UpdateDocumentDto } from './dto/update-document.dto';

const documentSortFields = new Set(['title', 'createdAt', 'updatedAt', 'fileSize', 'mimeType']);

export interface PreparedDocumentMetadata {
  fileName: string;
  fileExtension: string;
  storageKey: string;
  storageBucket: string;
  documentType: Prisma.DocumentCreateInput['documentType'];
}

@Injectable()
export class DocumentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(organisationId: string, query: ListDocumentsDto) {
    const { page, pageSize, skip, take } = getDocumentPagination(query);
    const where = this.buildWhere(organisationId, query);
    const sortBy = documentSortFields.has(query.sortBy ?? '') ? query.sortBy! : 'createdAt';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.document.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: query.sortDirection },
        include: this.documentIncludes(),
      }),
      this.prisma.document.count({ where }),
    ]);

    return toDocumentPaginatedResult(items, total, page, pageSize);
  }

  findById(organisationId: string, id: string) {
    return this.prisma.document.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: {
        ...this.documentIncludes(),
        versions: { orderBy: { versionNumber: 'desc' } },
        links: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async create(
    organisationId: string,
    ownerId: string,
    dto: CreateDocumentDto,
    metadata: PreparedDocumentMetadata,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const document = await tx.document.create({
        data: {
          organisationId,
          folderId: dto.folderId,
          ownerId,
          title: dto.title,
          description: dto.description,
          fileName: metadata.fileName,
          originalFileName: dto.originalFileName,
          mimeType: dto.mimeType,
          fileExtension: metadata.fileExtension,
          fileSize: dto.fileSize,
          storageKey: metadata.storageKey,
          storageBucket: metadata.storageBucket,
          checksum: dto.checksum,
          documentType: metadata.documentType,
          visibility: dto.visibility,
          isPinned: dto.isPinned,
        },
      });

      const version = await tx.documentVersion.create({
        data: {
          organisationId,
          documentId: document.id,
          versionNumber: 1,
          fileName: metadata.fileName,
          storageKey: metadata.storageKey,
          mimeType: dto.mimeType,
          fileSize: dto.fileSize,
          checksum: dto.checksum,
          uploadedById: ownerId,
          changeNote: 'Initial upload',
        },
      });

      return tx.document.update({
        where: { id: document.id },
        data: { currentVersionId: version.id },
        include: this.documentIncludes(),
      });
    });
  }

  update(organisationId: string, id: string, dto: UpdateDocumentDto) {
    return this.prisma.document.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: dto,
    });
  }

  setStatus(organisationId: string, id: string, status: DocumentStatus, deletedAt: Date | null) {
    return this.prisma.document.updateMany({
      where: { id, organisationId },
      data: { status, deletedAt },
    });
  }

  private buildWhere(organisationId: string, query: ListDocumentsDto): Prisma.DocumentWhereInput {
    const search = query.search?.trim();
    return {
      organisationId,
      deletedAt: null,
      ...(query.folderId ? { folderId: query.folderId } : {}),
      ...(query.ownerId ? { ownerId: query.ownerId } : {}),
      ...(query.documentType ? { documentType: query.documentType } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.visibility ? { visibility: query.visibility } : {}),
      ...(query.mimeType ? { mimeType: query.mimeType } : {}),
      ...(query.tagId ? { tags: { some: { tagId: query.tagId } } } : {}),
      ...(query.linkedEntityType && query.linkedEntityId
        ? {
            links: {
              some: { entityType: query.linkedEntityType as never, entityId: query.linkedEntityId },
            },
          }
        : {}),
      ...(query.createdFrom || query.createdTo
        ? {
            createdAt: {
              gte: query.createdFrom ? new Date(query.createdFrom) : undefined,
              lte: query.createdTo ? new Date(query.createdTo) : undefined,
            },
          }
        : {}),
      ...(query.updatedFrom || query.updatedTo
        ? {
            updatedAt: {
              gte: query.updatedFrom ? new Date(query.updatedFrom) : undefined,
              lte: query.updatedTo ? new Date(query.updatedTo) : undefined,
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { fileName: { contains: search, mode: 'insensitive' } },
              { originalFileName: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { owner: { name: { contains: search, mode: 'insensitive' } } },
              { tags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } },
            ],
          }
        : {}),
    };
  }

  private documentIncludes() {
    return {
      folder: { select: { id: true, name: true, path: true } },
      owner: { select: { id: true, name: true, email: true } },
      currentVersion: true,
      tags: { include: { tag: true } },
      _count: { select: { versions: true, activities: true, links: true } },
    } satisfies Prisma.DocumentInclude;
  }
}
