import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type { CreateWorkflowDto, ListAutomationDto, UpdateWorkflowDto } from './dto/automation.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogsService,
  ) {}

  async list(organisationId: string, query: ListAutomationDto) {
    const page = query.page;
    const pageSize = query.pageSize;
    const where: Prisma.WorkflowWhereInput = {
      organisationId,
      deletedAt: null,
      ...(query.search ? { name: { contains: query.search.trim(), mode: 'insensitive' } } : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.workflow.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
          triggers: true,
          conditions: true,
          actions: true,
          schedules: true,
          _count: { select: { executions: true } },
        },
      }),
      this.prisma.workflow.count({ where }),
    ]);
    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        pageCount: Math.ceil(total / pageSize),
        hasNextPage: page * pageSize < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(organisationId: string, id: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: {
        versions: true,
        triggers: true,
        conditions: true,
        actions: true,
        variables: true,
        schedules: true,
        executions: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!workflow) throw new NotFoundException('Workflow was not found.');
    return workflow;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateWorkflowDto) {
    const workflow = await this.prisma.$transaction(async (tx) => {
      const created = await tx.workflow.create({
        data: {
          organisationId,
          name: dto.name,
          description: dto.description,
          status: dto.status,
          enabled: dto.enabled ?? false,
          triggerType: dto.triggerType,
          createdById: actorUserId,
        },
      });

      await tx.workflowVersion.create({
        data: {
          organisationId,
          workflowId: created.id,
          version: 1,
          definition: this.toDefinition(dto),
        },
      });
      await tx.workflowTrigger.create({
        data: {
          organisationId,
          workflowId: created.id,
          type: dto.triggerType,
          config: (dto.triggerConfig ?? {}) as Prisma.InputJsonValue,
        },
      });
      if (dto.conditions?.length) {
        await tx.workflowCondition.createMany({
          data: dto.conditions.map((condition, index) => ({
            organisationId,
            workflowId: created.id,
            operator: condition.operator,
            field: condition.field,
            value: condition.value ?? {},
            position: index,
          })),
        });
      }
      if (dto.actions?.length) {
        await tx.workflowAction.createMany({
          data: dto.actions.map((action, index) => ({
            organisationId,
            workflowId: created.id,
            type: action.type,
            name: action.name,
            config: (action.config ?? {}) as Prisma.InputJsonValue,
            position: index,
          })),
        });
      }
      return tx.workflow.findUniqueOrThrow({
        where: { id: created.id },
        include: { triggers: true, conditions: true, actions: true, versions: true },
      });
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'workflow.created',
      entityType: 'workflow',
      entityId: workflow.id,
    });
    await this.prisma.workflowAudit.create({
      data: { organisationId, workflowId: workflow.id, actorUserId, action: 'workflow.created' },
    });
    return workflow;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateWorkflowDto) {
    await this.findOne(organisationId, id);
    const workflow = await this.prisma.workflow.update({ where: { id }, data: dto });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'workflow.updated',
      entityType: 'workflow',
      entityId: id,
    });
    return workflow;
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    await this.findOne(organisationId, id);
    await this.prisma.workflow.update({
      where: { id },
      data: { deletedAt: new Date(), enabled: false },
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'workflow.deleted',
      entityType: 'workflow',
      entityId: id,
    });
    return { success: true };
  }

  private toDefinition(dto: CreateWorkflowDto): Prisma.InputJsonValue {
    return JSON.parse(
      JSON.stringify({
        trigger: { type: dto.triggerType, config: dto.triggerConfig ?? {} },
        conditions: dto.conditions ?? [],
        actions: dto.actions ?? [],
        safeExecution: true,
      }),
    ) as Prisma.InputJsonValue;
  }
}
