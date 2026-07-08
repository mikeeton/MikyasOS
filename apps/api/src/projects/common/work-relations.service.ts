import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../infra/database/prisma.service';

@Injectable()
export class WorkRelationsService {
  constructor(private readonly prisma: PrismaService) {}

  async assertCompany(organisationId: string, companyId?: string | null) {
    if (!companyId) return;
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, organisationId, deletedAt: null },
      select: { id: true },
    });
    if (!company) throw new NotFoundException('Company was not found.');
  }

  async assertMember(organisationId: string, userId?: string | null) {
    if (!userId) return;
    const member = await this.prisma.organisationMember.findFirst({
      where: { organisationId, userId, deletedAt: null },
      select: { id: true },
    });
    if (!member) throw new NotFoundException('User was not found in this organisation.');
  }

  async assertProject(organisationId: string, projectId?: string | null) {
    if (!projectId) return;
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organisationId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException('Project was not found.');
  }

  async assertTask(organisationId: string, taskId?: string | null) {
    if (!taskId) return;
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, organisationId, deletedAt: null },
      select: { id: true },
    });
    if (!task) throw new NotFoundException('Task was not found.');
  }
}
