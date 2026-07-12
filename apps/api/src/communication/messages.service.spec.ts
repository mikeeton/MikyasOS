import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  it('creates a message, records activity, and emits realtime event', async () => {
    const prisma = {
      conversation: { count: jest.fn().mockResolvedValue(1) },
      message: {
        create: jest.fn().mockResolvedValue({
          id: 'message-id',
          conversationId: 'conversation-id',
          content: 'Hello',
        }),
      },
      messageActivity: { create: jest.fn().mockResolvedValue({ id: 'activity-id' }) },
    };
    const realtime = { emitMessage: jest.fn() };
    const audit = { record: jest.fn().mockResolvedValue({ id: 'audit-id' }) };
    const service = new MessagesService(prisma as never, realtime as never, audit as never);

    const result = await service.create('org-id', 'user-id', {
      conversationId: 'conversation-id',
      content: 'Hello',
    });

    expect(result.id).toBe('message-id');
    expect(realtime.emitMessage).toHaveBeenCalledWith('org-id', 'conversation-id', result);
    expect(audit.record).toHaveBeenCalledWith(expect.objectContaining({ entityType: 'message' }));
  });
});
