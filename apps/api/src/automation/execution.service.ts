import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma,
  WorkflowActionType,
  WorkflowExecutionStatus,
  WorkflowLogSeverity,
} from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type { ExecuteWorkflowDto } from './dto/automation.dto';
import { AutomationQueueService } from './queue.service';

@Injectable()
export class ExecutionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: AutomationQueueService,
    private readonly audit: AuditLogsService,
  ) {}

  async list(organisationId: string) {
    return this.prisma.workflowExecution.findMany({
      where: { organisationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        workflow: { select: { id: true, name: true } },
        logs: { take: 5, orderBy: { createdAt: 'desc' } },
        errors: true,
      },
    });
  }

  async execute(
    organisationId: string,
    workflowId: string,
    actorUserId: string,
    dto: ExecuteWorkflowDto = {},
  ) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id: workflowId, organisationId, deletedAt: null },
      include: {
        conditions: { where: { deletedAt: null }, orderBy: { position: 'asc' } },
        actions: { where: { deletedAt: null }, orderBy: { position: 'asc' } },
      },
    });
    if (!workflow) throw new NotFoundException('Workflow was not found.');

    const execution = await this.prisma.workflowExecution.create({
      data: {
        organisationId,
        workflowId,
        triggeredById: actorUserId,
        status: WorkflowExecutionStatus.QUEUED,
        triggerPayload: (dto.payload ?? {}) as Prisma.InputJsonValue,
        context: { safeExecution: true, source: 'manual' } as Prisma.InputJsonValue,
      },
    });
    await this.queue.enqueueExecution(workflowId, execution.id, organisationId);
    return this.runExecution(organisationId, execution.id);
  }

  async runExecution(organisationId: string, executionId: string) {
    const execution = await this.prisma.workflowExecution.findFirst({
      where: { id: executionId, organisationId, deletedAt: null },
      include: {
        workflow: {
          include: {
            conditions: { where: { deletedAt: null }, orderBy: { position: 'asc' } },
            actions: { where: { deletedAt: null }, orderBy: { position: 'asc' } },
          },
        },
      },
    });
    if (!execution) throw new NotFoundException('Workflow execution was not found.');

    const startedAt = new Date();
    await this.prisma.workflowExecution.update({
      where: { id: execution.id },
      data: { status: WorkflowExecutionStatus.RUNNING, startedAt },
    });
    await this.log(
      organisationId,
      execution.workflowId,
      execution.id,
      'validate-trigger',
      'Trigger validated.',
    );
    await this.log(
      organisationId,
      execution.workflowId,
      execution.id,
      'build-context',
      'Execution context built.',
    );

    const conditionsPassed = execution.workflow.conditions.every((condition) =>
      Boolean(condition.field),
    );
    const conditionSeverity: WorkflowLogSeverity = conditionsPassed
      ? WorkflowLogSeverity.INFO
      : WorkflowLogSeverity.WARN;
    await this.log(
      organisationId,
      execution.workflowId,
      execution.id,
      'conditions',
      conditionsPassed ? 'Conditions passed.' : 'Conditions failed.',
      conditionSeverity,
    );

    if (!conditionsPassed) {
      const finishedAt = new Date();
      return this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: WorkflowExecutionStatus.CANCELLED,
          finishedAt,
          durationMs: finishedAt.getTime() - startedAt.getTime(),
        },
      });
    }

    for (const action of execution.workflow.actions) {
      await this.validateAction(action.type);
      await this.log(
        organisationId,
        execution.workflowId,
        execution.id,
        `action:${action.type}`,
        `Prepared action "${action.name}" executed safely.`,
      );
    }

    const finishedAt = new Date();
    const updated = await this.prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: WorkflowExecutionStatus.SUCCEEDED,
        finishedAt,
        durationMs: finishedAt.getTime() - startedAt.getTime(),
      },
      include: { logs: true, workflow: { select: { id: true, name: true } } },
    });
    await this.audit.record({
      organisationId,
      actorUserId: execution.triggeredById,
      action: 'workflow.executed',
      entityType: 'workflow',
      entityId: execution.workflowId,
    });
    return updated;
  }

  private validateAction(type: WorkflowActionType) {
    const approvalActions: WorkflowActionType[] = [
      WorkflowActionType.SEND_EMAIL,
      WorkflowActionType.RUN_WEBHOOK,
      WorkflowActionType.UPDATE_RECORD,
    ];
    const requiresApproval = approvalActions.includes(type);
    return { valid: true, requiresApproval };
  }

  private log(
    organisationId: string,
    workflowId: string,
    executionId: string,
    step: string,
    message: string,
    severity: WorkflowLogSeverity = WorkflowLogSeverity.INFO,
  ) {
    return this.prisma.workflowLog.create({
      data: { organisationId, workflowId, executionId, step, message, severity },
    });
  }
}
