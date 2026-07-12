import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  getArchitecture() {
    return {
      inApp: true,
      emailPrepared: true,
      announcementDelivery: true,
      meetingInvitations: true,
      mentionNotifications: true,
      quietHours: true,
      futurePushNotifications: true,
    };
  }
}
