import { Injectable } from '@nestjs/common';

import { PrismaService } from '../infra/database/prisma.service';

@Injectable()
export class KnowledgeRetrievalService {
  constructor(private readonly prisma: PrismaService) {}

  async retrieve(organisationId: string, query: string) {
    const search = query.slice(0, 80);
    const [companies, projects, tasks, documents] = await Promise.all([
      this.prisma.company.findMany({
        where: { organisationId, deletedAt: null, name: { contains: search, mode: 'insensitive' } },
        take: 5,
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
      this.prisma.project.findMany({
        where: { organisationId, deletedAt: null, name: { contains: search, mode: 'insensitive' } },
        take: 5,
        select: { id: true, name: true, status: true, priority: true, updatedAt: true },
      }),
      this.prisma.task.findMany({
        where: {
          organisationId,
          deletedAt: null,
          title: { contains: search, mode: 'insensitive' },
        },
        take: 5,
        select: { id: true, title: true, status: true, priority: true, updatedAt: true },
      }),
      this.prisma.document.findMany({
        where: {
          organisationId,
          deletedAt: null,
          title: { contains: search, mode: 'insensitive' },
        },
        take: 5,
        select: { id: true, title: true, documentType: true, updatedAt: true },
      }),
    ]);

    return {
      query: search,
      vectorSearchPrepared: true,
      pgvectorArchitecture: 'reserved',
      sources: { companies, projects, tasks, documents },
      futureSources: ['policies', 'knowledge-notes', 'finance', 'meetings', 'calendar'],
    };
  }

  getStatus() {
    return {
      pgvectorPrepared: true,
      embeddingsEnabled: false,
      semanticSearchEnabled: false,
      retrievableSources: ['CRM', 'Projects', 'Tasks', 'Documents', 'Knowledge notes'],
      futureSources: ['Finance', 'Meetings', 'Calendar', 'Notifications', 'Automation'],
    };
  }
}
