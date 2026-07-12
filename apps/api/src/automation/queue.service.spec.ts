import { AutomationQueueService } from './queue.service';

describe('AutomationQueueService', () => {
  it('describes queue architecture and enqueues workflow execution jobs', async () => {
    const queue = { add: jest.fn().mockResolvedValue({ id: 'job-id' }) };
    const service = new AutomationQueueService(queue as never);

    await service.enqueueExecution('workflow-id', 'execution-id', 'org-id');

    expect(queue.add).toHaveBeenCalledWith(
      'workflow.execute',
      { workflowId: 'workflow-id', executionId: 'execution-id', organisationId: 'org-id' },
      expect.objectContaining({ attempts: 3 }),
    );
    expect(service.getQueueArchitecture()).toEqual(
      expect.objectContaining({ backgroundExecution: true, retryReady: true }),
    );
  });
});
