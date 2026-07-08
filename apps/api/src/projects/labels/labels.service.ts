import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectActivityType } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { WorkRelationsService } from '../common/work-relations.service';
import { ProjectActivitiesService } from '../project-activities/project-activities.service';
import type { AssignProjectLabelDto } from './dto/assign-project-label.dto';
import type { CreateProjectLabelDto } from './dto/create-project-label.dto';
import type { UpdateProjectLabelDto } from './dto/update-project-label.dto';

@Injectable()
export class LabelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relations: WorkRelationsService,
    private readonly activities: ProjectActivitiesService,
  ) {}

  list(organisationId: string) {
    return this.prisma.projectLabel.findMany({
      where: { organisationId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  create(organisationId: string, dto: CreateProjectLabelDto) {
    return this.prisma.projectLabel.create({
      data: { organisationId, name: dto.name, colour: dto.colour, icon: dto.icon },
    });
  }

  async update(organisationId: string, id: string, dto: UpdateProjectLabelDto) {
    await this.findOne(organisationId, id);
    return this.prisma.projectLabel.update({ where: { id }, data: dto });
  }

  async remove(organisationId: string, id: string) {
    await this.findOne(organisationId, id);
    await this.prisma.projectLabel.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  async assign(organisationId: string, actorUserId: string, dto: AssignProjectLabelDto) {
    const task = await this.prisma.task.findFirst({
      where: { id: dto.taskId, organisationId, deletedAt: null },
      select: { id: true, projectId: true },
    });
    if (!task) throw new NotFoundException('Task was not found.');
    await this.findOne(organisationId, dto.labelId);
    const label = await this.prisma.taskLabel.upsert({
      where: { taskId_labelId: { taskId: dto.taskId, labelId: dto.labelId } },
      create: { taskId: dto.taskId, labelId: dto.labelId },
      update: {},
    });
    await this.activities.record({
      organisationId,
      projectId: task.projectId,
      taskId: task.id,
      actorUserId,
      type: ProjectActivityType.LABEL_CHANGED,
      title: 'Task label assigned',
      metadata: { labelId: dto.labelId },
    });
    return label;
  }

  async unassign(organisationId: string, actorUserId: string, dto: AssignProjectLabelDto) {
    await this.relations.assertTask(organisationId, dto.taskId);
    await this.findOne(organisationId, dto.labelId);
    await this.prisma.taskLabel.deleteMany({
      where: { taskId: dto.taskId, labelId: dto.labelId },
    });
    await this.activities.record({
      organisationId,
      projectId: (await this.prisma.task.findUniqueOrThrow({ where: { id: dto.taskId } }))
        .projectId,
      taskId: dto.taskId,
      actorUserId,
      type: ProjectActivityType.LABEL_CHANGED,
      title: 'Task label removed',
      metadata: { labelId: dto.labelId },
    });
    return { success: true };
  }

  private async findOne(organisationId: string, id: string) {
    const label = await this.prisma.projectLabel.findFirst({
      where: { id, organisationId, deletedAt: null },
    });
    if (!label) throw new NotFoundException('Label was not found.');
    return label;
  }
}
