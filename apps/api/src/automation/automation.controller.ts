import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import {
  AutomationRiskService,
  WorkflowExplanationService,
  WorkflowGenerationService,
  WorkflowOptimisationService,
  WorkflowRecommendationService,
} from './automation-ai.service';
import {
  CreateApprovalDto,
  CreateScheduleDto,
  CreateVariableDto,
  CreateWorkflowDto,
  DecideApprovalDto,
  ExecuteWorkflowDto,
  IdParamDto,
  ListAutomationDto,
  UpdateWorkflowDto,
} from './dto/automation.dto';
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

@Controller({ path: 'automation', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class AutomationController {
  constructor(
    private readonly workflows: WorkflowsService,
    private readonly executions: ExecutionService,
    private readonly templates: TemplateService,
    private readonly scheduler: SchedulerService,
    private readonly variables: VariableService,
    private readonly approvals: ApprovalService,
    private readonly history: ExecutionHistoryService,
    private readonly queue: AutomationQueueService,
    private readonly recommendations: WorkflowRecommendationService,
    private readonly generation: WorkflowGenerationService,
    private readonly optimisation: WorkflowOptimisationService,
    private readonly explanation: WorkflowExplanationService,
    private readonly risk: AutomationRiskService,
  ) {}

  @Get('capabilities')
  @RequirePermissions('Automation.Read')
  capabilities() {
    return {
      architecture: [
        'AutomationModule',
        'WorkflowModule',
        'TriggerModule',
        'ConditionModule',
        'ActionModule',
        'ExecutionModule',
        'SchedulerModule',
        'QueueModule',
        'ApprovalModule',
        'TemplateModule',
        'VariableModule',
        'AuditModule',
        'ExecutionHistoryModule',
      ],
      triggers: [
        'Customer created',
        'Lead won',
        'Project created',
        'Task completed',
        'Document uploaded',
        'Meeting ended',
        'Invoice paid',
        'Calendar event',
        'Webhook received',
        'Manual trigger',
        'Scheduled trigger',
      ],
      actions: [
        'Create Task',
        'Assign Task',
        'Create Project',
        'Create Company',
        'Create Contact',
        'Send Notification',
        'Send Email',
        'Generate AI Summary',
        'Create Meeting',
        'Create Calendar Event',
        'Move CRM Stage',
        'Update Record',
        'Create Document',
        'Run Webhook',
        'Wait',
        'Approval',
      ],
      queue: this.queue.getQueueArchitecture(),
      aiPreparation: {
        recommendations: this.recommendations.getArchitecture(),
        generation: this.generation.getArchitecture(),
        optimisation: this.optimisation.getArchitecture(),
        explanation: this.explanation.getArchitecture(),
        risk: this.risk.getArchitecture(),
      },
    };
  }

  @Get('workflows')
  @RequirePermissions('Automation.Read')
  listWorkflows(@CurrentOrganisation() organisationId: string, @Query() query: ListAutomationDto) {
    return this.workflows.list(organisationId, query);
  }

  @Get('workflows/:id')
  @RequirePermissions('Automation.Read')
  workflow(@CurrentOrganisation() organisationId: string, @Param() params: IdParamDto) {
    return this.workflows.findOne(organisationId, params.id);
  }

  @Post('workflows')
  @RequirePermissions('Automation.Write')
  createWorkflow(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkflowDto,
  ) {
    return this.workflows.create(organisationId, user.id, dto);
  }

  @Patch('workflows/:id')
  @RequirePermissions('Automation.Write')
  updateWorkflow(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: UpdateWorkflowDto,
  ) {
    return this.workflows.update(organisationId, user.id, params.id, dto);
  }

  @Delete('workflows/:id')
  @RequirePermissions('Automation.Manage')
  deleteWorkflow(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
  ) {
    return this.workflows.remove(organisationId, user.id, params.id);
  }

  @Post('workflows/:id/execute')
  @RequirePermissions('Automation.Execute')
  executeWorkflow(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: ExecuteWorkflowDto,
  ) {
    return this.executions.execute(organisationId, params.id, user.id, dto);
  }

  @Get('executions')
  @RequirePermissions('Automation.Read')
  executionsList(@CurrentOrganisation() organisationId: string) {
    return this.executions.list(organisationId);
  }

  @Get('history')
  @RequirePermissions('Automation.Read')
  historyList(@CurrentOrganisation() organisationId: string) {
    return this.executions.list(organisationId);
  }

  @Get('logs')
  @RequirePermissions('Automation.Read')
  logs(@CurrentOrganisation() organisationId: string) {
    return this.history.logs(organisationId);
  }

  @Get('templates')
  @RequirePermissions('Automation.Read')
  templatesList(@CurrentOrganisation() organisationId: string) {
    return this.templates.list(organisationId);
  }

  @Get('schedules')
  @RequirePermissions('Automation.Read')
  schedules(@CurrentOrganisation() organisationId: string) {
    return this.scheduler.list(organisationId);
  }

  @Post('schedules')
  @RequirePermissions('Automation.Write')
  createSchedule(@CurrentOrganisation() organisationId: string, @Body() dto: CreateScheduleDto) {
    return this.scheduler.create(organisationId, dto);
  }

  @Get('variables')
  @RequirePermissions('Automation.Read')
  variablesList(@CurrentOrganisation() organisationId: string) {
    return this.variables.list(organisationId);
  }

  @Post('variables')
  @RequirePermissions('Automation.Write')
  createVariable(@CurrentOrganisation() organisationId: string, @Body() dto: CreateVariableDto) {
    return this.variables.create(organisationId, dto);
  }

  @Get('approvals')
  @RequirePermissions('Automation.Read')
  approvalsList(@CurrentOrganisation() organisationId: string) {
    return this.approvals.list(organisationId);
  }

  @Post('approvals')
  @RequirePermissions('Automation.Write')
  createApproval(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateApprovalDto,
  ) {
    return this.approvals.create(organisationId, user.id, dto);
  }

  @Patch('approvals/:id')
  @RequirePermissions('Automation.Approve')
  decideApproval(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: DecideApprovalDto,
  ) {
    return this.approvals.decide(organisationId, user.id, params.id, dto);
  }
}
