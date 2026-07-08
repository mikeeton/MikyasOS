import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../infra/database/prisma.service';
import type { ProjectSearchDto } from './dto/project-search.dto';

@Injectable()
export class ProjectSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(organisationId: string, dto: ProjectSearchDto) {
    const query = dto.q.trim();
    const limit = Math.min(dto.limit, 50);
    const [projects, tasks, labels, comments] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where: {
          organisationId,
          deletedAt: null,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { company: { name: { contains: query, mode: 'insensitive' } } },
            { owner: { name: { contains: query, mode: 'insensitive' } } },
            { status: { equals: this.toProjectStatus(query) } },
            { priority: { equals: this.toProjectPriority(query) } },
          ],
        },
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.task.findMany({
        where: {
          organisationId,
          deletedAt: null,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { assignee: { name: { contains: query, mode: 'insensitive' } } },
            { status: { equals: this.toTaskStatus(query) } },
            { priority: { equals: this.toTaskPriority(query) } },
            { labels: { some: { label: { name: { contains: query, mode: 'insensitive' } } } } },
          ],
        },
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.projectLabel.findMany({
        where: { organisationId, deletedAt: null, name: { contains: query, mode: 'insensitive' } },
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.projectComment.findMany({
        where: {
          organisationId,
          deletedAt: null,
          content: { contains: query, mode: 'insensitive' },
        },
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    return {
      query,
      architecture: {
        fullTextReady: true,
        semanticSearchReady: true,
        futureRagReady: true,
      },
      results: { projects, tasks, labels, comments },
    };
  }

  private toProjectStatus(query: string) {
    const normalized = query.trim().toUpperCase().replaceAll(' ', '_');
    return ['PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'].includes(normalized)
      ? (normalized as 'ACTIVE')
      : undefined;
  }

  private toProjectPriority(query: string) {
    const normalized = query.trim().toUpperCase();
    return ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(normalized)
      ? (normalized as 'HIGH')
      : undefined;
  }

  private toTaskStatus(query: string) {
    const normalized = query.trim().toUpperCase().replaceAll(' ', '_');
    return ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE', 'CANCELLED'].includes(normalized)
      ? (normalized as 'TODO')
      : undefined;
  }

  private toTaskPriority(query: string) {
    const normalized = query.trim().toUpperCase();
    return ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(normalized)
      ? (normalized as 'HIGH')
      : undefined;
  }
}
