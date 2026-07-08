import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { getWorkPagination, toWorkPaginatedResult } from '../common/work-pagination';
import type { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { MoveTaskDto } from './dto/move-task.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';

const taskSortFields = new Set([
  'title',
  'createdAt',
  'updatedAt',
  'dueDate',
  'priority',
  'status',
  'position',
]);

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(organisationId: string, query: ListWorkRecordsDto) {
    const { page, pageSize, skip, take } = getWorkPagination(query);
    const where = this.buildWhere(organisationId, query);
    const sortBy = taskSortFields.has(query.sortBy ?? '') ? query.sortBy! : 'createdAt';
    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: query.sortDirection },
        include: {
          project: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true, email: true } },
          reporter: { select: { id: true, name: true, email: true } },
          labels: { include: { label: true } },
          _count: { select: { comments: true, subtasks: true, files: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);
    return toWorkPaginatedResult(items, total, page, pageSize);
  }

  findById(organisationId: string, id: string) {
    return this.prisma.task.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: {
        project: { select: { id: true, name: true } },
        parentTask: { select: { id: true, title: true } },
        subtasks: {
          where: { deletedAt: null },
          orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
        },
        assignee: { select: { id: true, name: true, email: true } },
        reporter: { select: { id: true, name: true, email: true } },
        comments: { where: { deletedAt: null }, take: 50, orderBy: { createdAt: 'desc' } },
        files: { where: { deletedAt: null }, take: 25, orderBy: { createdAt: 'desc' } },
        labels: { include: { label: true } },
        timeEntries: { where: { deletedAt: null }, take: 50, orderBy: { startTime: 'desc' } },
      },
    });
  }

  create(organisationId: string, actorUserId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: this.toCreateData(organisationId, actorUserId, dto),
    });
  }

  update(organisationId: string, id: string, dto: UpdateTaskDto) {
    return this.prisma.task.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: this.toUpdateData(dto),
    });
  }

  move(organisationId: string, id: string, dto: MoveTaskDto) {
    return this.prisma.task.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: dto,
    });
  }

  assign(organisationId: string, id: string, assigneeId: string) {
    return this.prisma.task.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { assigneeId },
    });
  }

  complete(organisationId: string, id: string) {
    return this.prisma.task.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { status: 'DONE', completedAt: new Date() },
    });
  }

  softDelete(organisationId: string, id: string) {
    return this.prisma.task.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  private buildWhere(organisationId: string, query: ListWorkRecordsDto): Prisma.TaskWhereInput {
    const search = query.search?.trim();
    return {
      organisationId,
      deletedAt: null,
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.assigneeId ? { assigneeId: query.assigneeId } : {}),
      ...(query.status ? { status: query.status as Prisma.EnumTaskStatusFilter['equals'] } : {}),
      ...(query.priority
        ? { priority: query.priority as Prisma.EnumTaskPriorityFilter['equals'] }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { project: { name: { contains: search, mode: 'insensitive' } } },
              { assignee: { name: { contains: search, mode: 'insensitive' } } },
              { labels: { some: { label: { name: { contains: search, mode: 'insensitive' } } } } },
            ],
          }
        : {}),
    };
  }

  private toCreateData(organisationId: string, actorUserId: string, dto: CreateTaskDto) {
    return {
      ...dto,
      organisationId,
      reporterId: actorUserId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    };
  }

  private toUpdateData(dto: UpdateTaskDto) {
    return {
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      completedAt: dto.status === 'DONE' ? new Date() : undefined,
    };
  }
}
