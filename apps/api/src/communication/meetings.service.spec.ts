import { BadRequestException } from '@nestjs/common';

import { MeetingsService } from './meetings.service';

describe('MeetingsService', () => {
  it('rejects meetings whose end time is not after the start time', async () => {
    const service = new MeetingsService({} as never, {} as never, {} as never);

    await expect(
      service.create('org-id', 'user-id', {
        title: 'Bad meeting',
        startsAt: '2026-07-09T10:00:00.000Z',
        endsAt: '2026-07-09T09:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates meeting participants and emits invitations', async () => {
    const meeting = { id: 'meeting-id', title: 'Planning', participants: [] };
    type MeetingCreateInput = { data: { participants: { create: unknown[] } } };
    const meetingCreate = jest
      .fn<Promise<typeof meeting>, [MeetingCreateInput]>()
      .mockResolvedValue(meeting);
    const prisma = { meeting: { create: meetingCreate } };
    const realtime = { emitMeetingInvitation: jest.fn() };
    const audit = { record: jest.fn().mockResolvedValue({ id: 'audit-id' }) };
    const service = new MeetingsService(prisma as never, realtime as never, audit as never);

    const result = await service.create('org-id', 'user-id', {
      title: 'Planning',
      startsAt: '2026-07-09T09:00:00.000Z',
      endsAt: '2026-07-09T10:00:00.000Z',
      participants: [{ email: 'teammate@example.com', name: 'Teammate' }],
    });

    expect(result).toBe(meeting);
    expect(meetingCreate.mock.calls[0]).toBeDefined();
    const createCall = meetingCreate.mock.calls[0]![0];
    expect(Array.isArray(createCall.data.participants.create)).toBe(true);
    expect(createCall.data.participants.create).toHaveLength(2);
    expect(realtime.emitMeetingInvitation).toHaveBeenCalledWith('org-id', meeting);
  });
});
