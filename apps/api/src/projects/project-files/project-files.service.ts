import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectActivityType } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { StorageService } from '../../infra/storage/storage.service';
import { WorkRelationsService } from '../common/work-relations.service';
import type { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import { ProjectActivitiesService } from '../project-activities/project-activities.service';
import type { CreateProjectFileDto } from './dto/create-project-file.dto';

const allowedProjectMimeTypes = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

@Injectable()
export class ProjectFilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly relations: WorkRelationsService,
    private readonly activities: ProjectActivitiesService,
  ) {}

  list(organisationId: string, query: ListWorkRecordsDto) {
    return this.prisma.projectFile.findMany({
      where: {
        organisationId,
        deletedAt: null,
        ...(query.projectId ? { projectId: query.projectId } : {}),
      },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(query.pageSize, 100),
    });
  }

  async create(organisationId: string, actorUserId: string, dto: CreateProjectFileDto) {
    if (!allowedProjectMimeTypes.has(dto.mimeType))
      throw new BadRequestException('File type is not allowed.');
    await this.relations.assertProject(organisationId, dto.projectId);
    await this.relations.assertTask(organisationId, dto.taskId);
    if (dto.commentId) await this.assertComment(organisationId, dto.commentId);
    const file = await this.prisma.projectFile.create({
      data: { ...dto, organisationId, uploadedById: actorUserId },
    });
    await this.activities.record({
      organisationId,
      projectId: dto.projectId,
      taskId: dto.taskId,
      actorUserId,
      type: ProjectActivityType.FILE_UPLOADED,
      title: 'Project file added',
      description: file.originalFilename,
    });
    return file;
  }

  async download(organisationId: string, id: string) {
    const file = await this.findOne(organisationId, id);
    return {
      file,
      downloadUrl: await this.storage.createPresignedDownloadUrl(file.storageKey),
    };
  }

  async remove(organisationId: string, id: string) {
    await this.findOne(organisationId, id);
    await this.prisma.projectFile.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  private async findOne(organisationId: string, id: string) {
    const file = await this.prisma.projectFile.findFirst({
      where: { id, organisationId, deletedAt: null },
    });
    if (!file) throw new NotFoundException('File was not found.');
    return file;
  }

  private async assertComment(organisationId: string, id: string) {
    const comment = await this.prisma.projectComment.findFirst({
      where: { id, organisationId, deletedAt: null },
    });
    if (!comment) throw new NotFoundException('Comment was not found.');
  }
}
