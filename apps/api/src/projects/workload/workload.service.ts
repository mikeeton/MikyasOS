import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../infra/database/prisma.service';

@Injectable()
export class WorkloadService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(organisationId: string) {
    const members = await this.prisma.organisationMember.findMany({
      where: { organisationId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            assignedTasks: {
              where: {
                organisationId,
                deletedAt: null,
                status: { notIn: ['DONE', 'CANCELLED'] },
              },
              select: {
                id: true,
                title: true,
                status: true,
                priority: true,
                estimatedHours: true,
                dueDate: true,
                project: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return members.map(({ user }) => {
      const estimatedHours = user.assignedTasks.reduce(
        (total, task) => total + Number(task.estimatedHours ?? 0),
        0,
      );
      return {
        user: { id: user.id, name: user.name, email: user.email },
        openTasks: user.assignedTasks.length,
        estimatedHours,
        capacityStatus:
          estimatedHours > 40 ? 'overloaded' : estimatedHours > 30 ? 'busy' : 'available',
        tasks: user.assignedTasks,
      };
    });
  }
}
