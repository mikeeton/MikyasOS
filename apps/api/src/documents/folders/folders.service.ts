import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentActivityAction } from '@prisma/client';

import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import type { CreateFolderDto } from '../dto/create-folder.dto';
import type { UpdateFolderDto } from '../dto/update-folder.dto';
import { DocumentActivitiesService } from '../activities/document-activities.service';
import { FoldersRepository } from './folders.repository';

@Injectable()
export class FoldersService {
  constructor(
    private readonly folders: FoldersRepository,
    private readonly activities: DocumentActivitiesService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string, parentFolderId?: string) {
    return this.folders.list(organisationId, parentFolderId);
  }

  async findOne(organisationId: string, id: string) {
    const folder = await this.folders.findById(organisationId, id);
    if (!folder) throw new NotFoundException('Folder was not found.');
    return folder;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateFolderDto) {
    const hierarchy = await this.buildHierarchy(organisationId, dto.name, dto.parentFolderId);
    const folder = await this.folders.create(organisationId, actorUserId, dto, hierarchy);
    await this.activities.record({
      organisationId,
      folderId: folder.id,
      actorId: actorUserId,
      action: DocumentActivityAction.FOLDER_CREATED,
      metadata: { name: folder.name },
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'folder.created',
      entityType: 'folder',
      entityId: folder.id,
    });
    return folder;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateFolderDto) {
    const current = await this.findOne(organisationId, id);
    const parentFolderId = Object.prototype.hasOwnProperty.call(dto, 'parentFolderId')
      ? (dto.parentFolderId ?? undefined)
      : (current.parentFolderId ?? undefined);

    if (parentFolderId) await this.assertNotCircular(organisationId, id, parentFolderId);

    const hierarchy =
      dto.name || Object.prototype.hasOwnProperty.call(dto, 'parentFolderId')
        ? await this.buildHierarchy(organisationId, dto.name ?? current.name, parentFolderId)
        : undefined;

    const result = await this.folders.update(organisationId, id, dto, hierarchy);
    if (result.count === 0) throw new NotFoundException('Folder was not found.');

    await this.activities.record({
      organisationId,
      folderId: id,
      actorId: actorUserId,
      action: dto.name
        ? DocumentActivityAction.FOLDER_RENAMED
        : DocumentActivityAction.FOLDER_MOVED,
      metadata: {
        parentFolderId: dto.parentFolderId,
        name: dto.name,
        description: dto.description,
        colour: dto.colour,
        icon: dto.icon,
        visibility: dto.visibility,
      },
    });
    return this.findOne(organisationId, id);
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const result = await this.folders.softDelete(organisationId, id);
    if (result.count === 0) throw new NotFoundException('Folder was not found.');
    await this.activities.record({
      organisationId,
      folderId: id,
      actorId: actorUserId,
      action: DocumentActivityAction.FOLDER_DELETED,
    });
    return { success: true };
  }

  private async buildHierarchy(organisationId: string, name: string, parentFolderId?: string) {
    if (!parentFolderId) return { path: `/${name}`, depth: 0 };
    const parent = await this.findOne(organisationId, parentFolderId);
    return { path: `${parent.path}/${name}`, depth: parent.depth + 1 };
  }

  private async assertNotCircular(
    organisationId: string,
    folderId: string,
    parentFolderId: string,
  ) {
    let cursor: string | null = parentFolderId;
    while (cursor) {
      if (cursor === folderId) {
        throw new BadRequestException('A folder cannot be moved inside itself.');
      }
      const parent = await this.folders.findById(organisationId, cursor);
      cursor = parent?.parentFolderId ?? null;
    }
  }
}
