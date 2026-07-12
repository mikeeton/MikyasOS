import { WorkflowActionType, WorkflowStatus, WorkflowTriggerType } from '@prisma/client';

import { WorkflowsService } from './workflows.service';

describe('WorkflowsService', () => {
  it('creates a workflow with version, trigger, actions, and audit records', async () => {
    type WorkflowCreateInput = {
      data: { organisationId: string; createdById: string };
    };
    type VersionCreateInput = {
      data: { workflowId: string; version: number };
    };
    const workflow = { id: 'workflow-id', name: 'Customer onboarding' };
    const workflowCreate = jest
      .fn<Promise<typeof workflow>, [WorkflowCreateInput]>()
      .mockResolvedValue(workflow);
    const versionCreate = jest
      .fn<Promise<{ id: string }>, [VersionCreateInput]>()
      .mockResolvedValue({ id: 'version-id' });
    const tx = {
      workflow: {
        create: workflowCreate,
        findUniqueOrThrow: jest.fn().mockResolvedValue({
          ...workflow,
          triggers: [],
          conditions: [],
          actions: [],
          versions: [],
        }),
      },
      workflowVersion: { create: versionCreate },
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

    const workflowCreateCall = workflowCreate.mock.calls[0]?.[0];
    const versionCreateCall = versionCreate.mock.calls[0]?.[0];
    expect(workflowCreateCall?.data.organisationId).toBe('org-id');
    expect(workflowCreateCall?.data.createdById).toBe('user-id');
    expect(versionCreateCall?.data.workflowId).toBe('workflow-id');
    expect(versionCreateCall?.data.version).toBe(1);
    expect(tx.workflowTrigger.create).toHaveBeenCalled();
    expect(tx.workflowAction.createMany).toHaveBeenCalled();
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'workflow.created', entityType: 'workflow' }),
    );
  });
});
