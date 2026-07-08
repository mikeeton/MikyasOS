import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectActivityType } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { WorkRelationsService } from '../common/work-relations.service';
import type { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import { ProjectActivitiesService } from '../project-activities/project-activities.service';
import type { CreateMilestoneDto } from './dto/create-milestone.dto';
import type { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relations: WorkRelationsService,
    private readonly activities: ProjectActivitiesService,
  ) {}

  list(organisationId: string, query: ListWorkRecordsDto) {
    return this.prisma.projectMilestone.findMany({
      where: {
        project: { organisationId, deletedAt: null },
        deletedAt: null,
        ...(query.projectId ? { projectId: query.projectId } : {}),
        ...(query.status ? { status: query.status as never } : {}),
      },
      orderBy: { dueDate: 'asc' },
      take: Math.min(query.pageSize, 100),
    });
  }

  async create(organisationId: string, actorUserId: string, dto: CreateMilestoneDto) {
    await this.relations.assertProject(organisationId, dto.projectId);
    const milestone = await this.prisma.projectMilestone.create({
      data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined },
    });
    await this.activities.record({
      organisationId,
      projectId: dto.projectId,
      milestoneId: milestone.id,
      actorUserId,
      type: ProjectActivityType.MILESTONE_UPDATED,
      title: 'Milestone created',
      description: milestone.title,
    });
    return milestone;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateMilestoneDto) {
    const existing = await this.findOne(organisationId, id);
    if (dto.projectId) await this.relations.assertProject(organisationId, dto.projectId);
    const milestone = await this.prisma.projectMilestone.update({
      where: { id },
      data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined },
    });
    await this.activities.record({
      organisationId,
      projectId: dto.projectId ?? existing.projectId,
      milestoneId: id,
      actorUserId,
      type: ProjectActivityType.MILESTONE_UPDATED,
      title: 'Milestone updated',
    });
    return milestone;
  }

  async remove(organisationId: string, id: string) {
    await this.findOne(organisationId, id);
    await this.prisma.projectMilestone.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  private async findOne(organisationId: string, id: string) {
    const milestone = await this.prisma.projectMilestone.findFirst({
      where: { id, deletedAt: null, project: { organisationId, deletedAt: null } },
    });
    if (!milestone) throw new NotFoundException('Milestone was not found.');
    return milestone;
  }
}
