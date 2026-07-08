import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { getWorkPagination, toWorkPaginatedResult } from '../common/work-pagination';
import type { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';

const projectSortFields = new Set([
  'name',
  'createdAt',
  'updatedAt',
  'dueDate',
  'priority',
  'status',
]);

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(organisationId: string, query: ListWorkRecordsDto) {
    const { page, pageSize, skip, take } = getWorkPagination(query);
    const where = this.buildWhere(organisationId, query);
    const sortBy = projectSortFields.has(query.sortBy ?? '') ? query.sortBy! : 'createdAt';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: query.sortDirection },
        include: {
          company: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { tasks: true, milestones: true, files: true, comments: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return toWorkPaginatedResult(items, total, page, pageSize);
  }

  findById(organisationId: string, id: string) {
    return this.prisma.project.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: {
        company: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true } },
        tasks: {
          where: { deletedAt: null },
          take: 50,
          orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
        },
        milestones: { where: { deletedAt: null }, take: 25, orderBy: { dueDate: 'asc' } },
        files: { where: { deletedAt: null }, take: 25, orderBy: { createdAt: 'desc' } },
        activities: { take: 100, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  create(organisationId: string, actorUserId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: this.toPrismaData(organisationId, actorUserId, dto),
    });
  }

  update(organisationId: string, id: string, dto: UpdateProjectDto) {
    return this.prisma.project.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: this.toUpdateData(dto),
    });
  }

  archive(organisationId: string, id: string) {
    return this.prisma.project.updateMany({
      where: { id, organisationId, deletedAt: null, archivedAt: null },
      data: { status: 'ARCHIVED', archivedAt: new Date() },
    });
  }

  restore(organisationId: string, id: string) {
    return this.prisma.project.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { status: 'ACTIVE', archivedAt: null },
    });
  }

  softDelete(organisationId: string, id: string) {
    return this.prisma.project.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  private buildWhere(organisationId: string, query: ListWorkRecordsDto): Prisma.ProjectWhereInput {
    const search = query.search?.trim();
    return {
      organisationId,
      deletedAt: null,
      ...(query.status ? { status: query.status as Prisma.EnumProjectStatusFilter['equals'] } : {}),
      ...(query.priority
        ? { priority: query.priority as Prisma.EnumProjectPriorityFilter['equals'] }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { company: { name: { contains: search, mode: 'insensitive' } } },
              { owner: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };
  }

  private toPrismaData(organisationId: string, actorUserId: string, dto: CreateProjectDto) {
    return {
      organisationId,
      ownerId: dto.ownerId ?? actorUserId,
      companyId: dto.companyId,
      name: dto.name,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      progress: dto.progress,
      budget: dto.budget,
      estimatedHours: dto.estimatedHours,
      actualHours: dto.actualHours,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    };
  }

  private toUpdateData(dto: UpdateProjectDto) {
    return {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      completedAt: dto.status === 'COMPLETED' ? new Date() : undefined,
    };
  }
}
