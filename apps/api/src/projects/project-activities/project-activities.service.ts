import { Injectable } from '@nestjs/common';
import type { Prisma, ProjectActivityType } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import type { ListWorkRecordsDto } from '../dto/list-work-records.dto';

type RecordProjectActivityInput = {
  organisationId: string;
  projectId: string;
  actorUserId?: string | null;
  taskId?: string | null;
  milestoneId?: string | null;
  type: ProjectActivityType;
  title: string;
  description?: string | null;
  metadata?: Prisma.InputJsonValue;
};

@Injectable()
export class ProjectActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: RecordProjectActivityInput) {
    return this.prisma.projectActivity.create({
      data: {
        organisationId: input.organisationId,
        projectId: input.projectId,
        actorUserId: input.actorUserId,
        taskId: input.taskId,
        milestoneId: input.milestoneId,
        type: input.type,
        title: input.title,
        description: input.description,
        metadata: input.metadata,
      },
    });
  }

  list(organisationId: string, query: ListWorkRecordsDto) {
    return this.prisma.projectActivity.findMany({
      where: {
        organisationId,
        ...(query.projectId ? { projectId: query.projectId } : {}),
        ...(query.status ? { type: query.status as ProjectActivityType } : {}),
      },
      include: {
        actorUser: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
        milestone: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(query.pageSize, 100),
    });
  }
}
