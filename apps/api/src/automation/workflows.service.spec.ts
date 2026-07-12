import { WorkflowActionType, WorkflowStatus, WorkflowTriggerType } from '@prisma/client';

import { WorkflowsService } from './workflows.service';

describe('WorkflowsService', () => {
  it('creates a workflow with version, trigger, actions, and audit records', async () => {
    const workflow = { id: 'workflow-id', name: 'Customer onboarding' };
    const tx = {
      workflow: {
        create: jest.fn().mockResolvedValue(workflow),
        findUniqueOrThrow: jest.fn().mockResolvedValue({
          ...workflow,
          triggers: [],
          conditions: [],
          actions: [],
          versions: [],
        }),
      },
      workflowVersion: { create: jest.fn().mockResolvedValue({ id: 'version-id' }) },
      workflowTrigger: { create: jest.fn().mockResolvedValue({ id: 'trigger-id' }) },
      workflowCondition: { createMany: jest.fn().mockResolvedValue({ count: 1 }) },
      workflowAction: { createMany: jest.fn().mockResolvedValue({ count: 1 }) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
      workflowAudit: { create: jest.fn().mockResolvedValue({ id: 'audit-id' }) },
    };
    const audit = { record: jest.fn().mockResolvedValue({ id: 'global-audit-id' }) };
    const service = new WorkflowsService(prisma as never, audit as never);

    await service.create('org-id', 'user-id', {
      name: 'Customer onboarding',
      status: WorkflowStatus.ACTIVE,
      enabled: true,
      triggerType: WorkflowTriggerType.MANUAL,
      conditions: [{ operator: 'EQUALS', field: 'company.status', value: 'customer' }],
      actions: [
        {
          type: WorkflowActionType.CREATE_PROJECT,
          name: 'Create onboarding project',
          config: { template: 'standard' },
        },
      ],
    });

    expect(tx.workflow.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ organisationId: 'org-id', createdById: 'user-id' }),
      }),
    );
    expect(tx.workflowVersion.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ workflowId: 'workflow-id', version: 1 }),
      }),
    );
    expect(tx.workflowTrigger.create).toHaveBeenCalled();
    expect(tx.workflowAction.createMany).toHaveBeenCalled();
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'workflow.created', entityType: 'workflow' }),
    );
  });
});
