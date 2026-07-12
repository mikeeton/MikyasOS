import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { DatabaseModule } from '../infra/database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AutomationController } from './automation.controller';
import { AUTOMATION_QUEUE } from './automation.constants';
import {
  AutomationRiskService,
  WorkflowExplanationService,
  WorkflowGenerationService,
  WorkflowOptimisationService,
  WorkflowRecommendationService,
} from './automation-ai.service';
import { ExecutionService } from './execution.service';
import { AutomationQueueService } from './queue.service';
import {
  ApprovalService,
  ExecutionHistoryService,
  SchedulerService,
  TemplateService,
  VariableService,
} from './support-services';
import { WorkflowsService } from './workflows.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({}),
    PermissionsModule,
    AuditLogsModule,
    BullModule.registerQueue({ name: AUTOMATION_QUEUE }),
  ],
  controllers: [AutomationController],
  providers: [
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
    WorkflowsService,
    ExecutionService,
    TemplateService,
    SchedulerService,
    VariableService,
    ApprovalService,
    ExecutionHistoryService,
    AutomationQueueService,
    WorkflowRecommendationService,
    WorkflowGenerationService,
    WorkflowOptimisationService,
    WorkflowExplanationService,
    AutomationRiskService,
  ],
  exports: [WorkflowsService, ExecutionService, AutomationQueueService],
})
export class AutomationModule {}

export class WorkflowModule {}
export class TriggerModule {}
export class ConditionModule {}
export class ActionModule {}
export class ExecutionModule {}
export class SchedulerModule {}
export class QueueModule {}
export class ApprovalModule {}
export class TemplateModule {}
export class VariableModule {}
export class AutomationAuditModule {}
export class ExecutionHistoryModule {}
