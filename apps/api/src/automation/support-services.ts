import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../infra/database/prisma.service';
import { WORKFLOW_TEMPLATES } from './automation.constants';
import type {
  CreateApprovalDto,
  CreateScheduleDto,
  CreateVariableDto,
  DecideApprovalDto,
} from './dto/automation.dto';

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async list(organisationId: string) {
    const templates = await this.prisma.workflowTemplate.findMany({
      where: { deletedAt: null, OR: [{ organisationId }, { isSystem: true }] },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    if (templates.length > 0) return templates;
    return WORKFLOW_TEMPLATES.map((template) => ({
      id: `${template.category}-${template.name}`.replaceAll(' ', '-').toLowerCase(),
      organisationId,
      name: template.name,
      description: template.description,
      category: template.category,
      isSystem: true,
      definition: { trigger: 'manual', actions: [], prepared: true },
      createdAt: new Date(0),
      updatedAt: new Date(0),
      deletedAt: null,
    }));
  }
}

@Injectable()
export class SchedulerService {
  constructor(private readonly prisma: PrismaService) {}

  create(organisationId: string, dto: CreateScheduleDto) {
    return this.prisma.workflowSchedule.create({
      data: {
        organisationId,
        workflowId: dto.workflowId,
        type: dto.type,
        cronExpression: dto.cronExpression,
        timezone: dto.timezone ?? 'UTC',
        nextRunAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
  }

  list(organisationId: string) {
    return this.prisma.workflowSchedule.findMany({
      where: { organisationId, deletedAt: null },
      include: { workflow: { select: { id: true, name: true } } },
      orderBy: { nextRunAt: 'asc' },
    });
  }
}

@Injectable()
export class VariableService {
  constructor(private readonly prisma: PrismaService) {}

  create(organisationId: string, dto: CreateVariableDto) {
    return this.prisma.workflowVariable.create({
      data: {
        organisationId,
        workflowId: dto.workflowId,
        key: dto.key,
        value: dto.value ?? {},
        isSecret: dto.isSecret ?? false,
      },
    });
  }

  list(organisationId: string) {
    return this.prisma.workflowVariable.findMany({
      where: { organisationId, deletedAt: null },
      orderBy: { key: 'asc' },
    });
  }
}

@Injectable()
export class ApprovalService {
  constructor(private readonly prisma: PrismaService) {}

  create(organisationId: string, requestedById: string, dto: CreateApprovalDto) {
    return this.prisma.workflowApproval.create({
      data: {
        organisationId,
        workflowId: dto.workflowId,
        executionId: dto.executionId,
        requestedById,
        title: dto.title,
        details: (dto.details ?? {}) as Prisma.InputJsonValue,
      },
    });
  }

  list(organisationId: string) {
    return this.prisma.workflowApproval.findMany({
      where: { organisationId, deletedAt: null },
      include: { workflow: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async decide(organisationId: string, reviewerId: string, id: string, dto: DecideApprovalDto) {
    const approval = await this.prisma.workflowApproval.findFirst({
      where: { id, organisationId, deletedAt: null },
    });
    if (!approval) throw new NotFoundException('Workflow approval was not found.');
    return this.prisma.workflowApproval.update({
      where: { id },
      data: { status: dto.status, reviewerId, decidedAt: new Date() },
    });
  }
}

@Injectable()
export class ExecutionHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  logs(organisationId: string) {
    return this.prisma.workflowLog.findMany({
      where: { organisationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { workflow: { select: { id: true, name: true } } },
    });
  }
}
