import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  it('describes notification architecture for communication events', () => {
    const service = new NotificationsService();

    expect(service.getArchitecture()).toEqual(
      expect.objectContaining({
        announcementDelivery: true,
        meetingInvitations: true,
        mentionNotifications: true,
      }),
    );
  });
});
