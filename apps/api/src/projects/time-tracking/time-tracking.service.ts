import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectActivityType } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { WorkRelationsService } from '../common/work-relations.service';
import type { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import { ProjectActivitiesService } from '../project-activities/project-activities.service';
import type { CreateTimeEntryDto } from './dto/create-time-entry.dto';

@Injectable()
export class TimeTrackingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relations: WorkRelationsService,
    private readonly activities: ProjectActivitiesService,
  ) {}

  list(organisationId: string, query: ListWorkRecordsDto) {
    return this.prisma.timeEntry.findMany({
      where: {
        organisationId,
        deletedAt: null,
        ...(query.assigneeId ? { userId: query.assigneeId } : {}),
        ...(query.projectId ? { task: { projectId: query.projectId } } : {}),
      },
      include: {
        task: { select: { id: true, title: true, projectId: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startTime: 'desc' },
      take: Math.min(query.pageSize, 100),
    });
  }

  async create(organisationId: string, actorUserId: string, dto: CreateTimeEntryDto) {
    const userId = dto.userId ?? actorUserId;
    await this.relations.assertMember(organisationId, userId);
    const task = await this.prisma.task.findFirst({
      where: { id: dto.taskId, organisationId, deletedAt: null },
      select: { id: true, projectId: true },
    });
    if (!task) throw new NotFoundException('Task was not found.');
    const startTime = new Date(dto.startTime);
    const endTime = dto.endTime ? new Date(dto.endTime) : undefined;
    if (endTime && endTime < startTime)
      throw new BadRequestException('End time must be after start time.');
    const durationMinutes =
      dto.durationMinutes ??
      (endTime
        ? Math.max(1, Math.round((endTime.getTime() - startTime.getTime()) / 60000))
        : undefined);
    const entry = await this.prisma.timeEntry.create({
      data: {
        organisationId,
        taskId: dto.taskId,
        userId,
        startTime,
        endTime,
        durationMinutes,
        manualEntry: dto.manualEntry ?? Boolean(dto.durationMinutes),
        description: dto.description,
      },
    });
    await this.activities.record({
      organisationId,
      projectId: task.projectId,
      taskId: task.id,
      actorUserId,
      type: ProjectActivityType.TIME_TRACKED,
      title: 'Time tracked',
      metadata: { durationMinutes },
    });
    return entry;
  }

  async remove(organisationId: string, id: string) {
    const result = await this.prisma.timeEntry.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (result.count === 0) throw new NotFoundException('Time entry was not found.');
    return { success: true };
  }
}
