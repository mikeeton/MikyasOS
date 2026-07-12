import { ConversationType } from '@prisma/client';

import { ConversationsService } from './conversations.service';

describe('ConversationsService', () => {
  it('creates a conversation with the actor as owner and requested members', async () => {
    type ConversationCreateInput = {
      data: {
        organisationId: string;
        createdById: string;
        members: { create: Array<{ userId: string; role: string }> };
      };
    };
    const conversationCreate = jest
      .fn<Promise<{ id: string; members: unknown[] }>, [ConversationCreateInput]>()
      .mockResolvedValue({ id: 'conversation-id', members: [] });
    const prisma = {
      conversation: {
        create: conversationCreate,
      },
      messageActivity: { create: jest.fn().mockResolvedValue({ id: 'activity-id' }) },
    };
    const audit = { record: jest.fn().mockResolvedValue({ id: 'audit-id' }) };
    const service = new ConversationsService(prisma as never, audit as never);

    await service.create('org-id', 'actor-id', {
      type: ConversationType.CHANNEL,
      name: 'General',
      memberUserIds: ['member-id'],
    });

    expect(conversationCreate.mock.calls[0]).toBeDefined();
    const createCall = conversationCreate.mock.calls[0]![0];
    expect(createCall.data.organisationId).toBe('org-id');
    expect(createCall.data.createdById).toBe('actor-id');
    expect(createCall.data.members.create).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ userId: 'actor-id', role: 'OWNER' }),
        expect.objectContaining({ userId: 'member-id', role: 'MEMBER' }),
      ]),
    );
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'conversation.created' }),
    );
  });
});
