import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectActivityType } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { WorkRelationsService } from '../common/work-relations.service';
import type { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import { ProjectActivitiesService } from '../project-activities/project-activities.service';
import type { CreateProjectCommentDto } from './dto/create-project-comment.dto';
import type { UpdateProjectCommentDto } from './dto/update-project-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relations: WorkRelationsService,
    private readonly activities: ProjectActivitiesService,
  ) {}

  list(organisationId: string, query: ListWorkRecordsDto) {
    return this.prisma.projectComment.findMany({
      where: {
        organisationId,
        deletedAt: null,
        ...(query.projectId ? { projectId: query.projectId } : {}),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        replies: { where: { deletedAt: null }, take: 10, orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(query.pageSize, 100),
    });
  }

  async create(organisationId: string, actorUserId: string, dto: CreateProjectCommentDto) {
    await this.relations.assertProject(organisationId, dto.projectId);
    await this.relations.assertTask(organisationId, dto.taskId);
    if (dto.parentCommentId) await this.findOne(organisationId, dto.parentCommentId);
    if (dto.mentions) {
      await Promise.all(
        dto.mentions.map((userId) => this.relations.assertMember(organisationId, userId)),
      );
    }
    const comment = await this.prisma.projectComment.create({
      data: {
        organisationId,
        projectId: dto.projectId,
        taskId: dto.taskId,
        parentCommentId: dto.parentCommentId,
        authorId: actorUserId,
        content: dto.content,
        mentions: dto.mentions ?? [],
      },
    });
    await this.activities.record({
      organisationId,
      projectId: dto.projectId,
      taskId: dto.taskId,
      actorUserId,
      type: ProjectActivityType.COMMENT_ADDED,
      title: 'Comment added',
    });
    return comment;
  }

  async update(organisationId: string, id: string, dto: UpdateProjectCommentDto) {
    await this.findOne(organisationId, id);
    return this.prisma.projectComment.update({
      where: { id },
      data: { content: dto.content, mentions: dto.mentions },
    });
  }

  async remove(organisationId: string, id: string) {
    await this.findOne(organisationId, id);
    await this.prisma.projectComment.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  private async findOne(organisationId: string, id: string) {
    const comment = await this.prisma.projectComment.findFirst({
      where: { id, organisationId, deletedAt: null },
    });
    if (!comment) throw new NotFoundException('Comment was not found.');
    return comment;
  }
}
