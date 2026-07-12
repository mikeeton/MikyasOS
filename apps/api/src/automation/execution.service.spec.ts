import { WorkflowActionType, WorkflowExecutionStatus, WorkflowTriggerType } from '@prisma/client';

import { ExecutionService } from './execution.service';

describe('ExecutionService', () => {
  it('runs a workflow, logs every stage, and marks it succeeded', async () => {
    const workflow = {
      id: 'workflow-id',
      conditions: [{ field: 'company.status' }],
      actions: [{ type: WorkflowActionType.CREATE_TASK, name: 'Create kickoff task' }],
    };
    const execution = {
      id: 'execution-id',
      workflowId: 'workflow-id',
      triggeredById: 'user-id',
      workflow,
    };
    const prisma = {
      workflow: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'workflow-id',
          organisationId: 'org-id',
          triggerType: WorkflowTriggerType.MANUAL,
        }),
      },
      workflowExecution: {
        create: jest.fn().mockResolvedValue({ id: 'execution-id' }),
        findFirst: jest.fn().mockResolvedValue(execution),
        update: jest
          .fn()
          .mockResolvedValueOnce({ id: 'execution-id', status: WorkflowExecutionStatus.RUNNING })
          .mockResolvedValueOnce({
            id: 'execution-id',
            status: WorkflowExecutionStatus.SUCCEEDED,
            workflow: { id: 'workflow-id', name: 'Demo' },
            logs: [],
          }),
      },
      workflowLog: { create: jest.fn().mockResolvedValue({ id: 'log-id' }) },
    };
    const queue = { enqueueExecution: jest.fn().mockResolvedValue({ id: 'job-id' }) };
    const audit = { record: jest.fn().mockResolvedValue({ id: 'audit-id' }) };
    const service = new ExecutionService(prisma as never, queue as never, audit as never);

    const result = await service.execute('org-id', 'workflow-id', 'user-id', {
      payload: { source: 'test' },
    });

    expect(result.status).toBe(WorkflowExecutionStatus.SUCCEEDED);
    expect(queue.enqueueExecution).toHaveBeenCalledWith('workflow-id', 'execution-id', 'org-id');
    expect(prisma.workflowLog.create).toHaveBeenCalledTimes(4);
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'workflow.executed', entityId: 'workflow-id' }),
    );
  });
});
