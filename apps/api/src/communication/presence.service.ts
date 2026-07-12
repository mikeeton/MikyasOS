import { Injectable } from '@nestjs/common';

import { PrismaService } from '../infra/database/prisma.service';
import type { UpdatePresenceDto } from './dto/communication.dto';
import { RealtimeGateway } from './realtime/realtime.gateway';

@Injectable()
export class PresenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  list(organisationId: string) {
    return this.prisma.notificationPreference.findMany({
      where: { organisationId, deletedAt: null },
      include: {
        user: { select: { id: true, name: true, email: true } },
        currentProject: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async update(organisationId: string, userId: string, dto: UpdatePresenceDto) {
    const presence = await this.prisma.notificationPreference.upsert({
      where: { organisationId_userId_channel: { organisationId, userId, channel: 'in_app' } },
      update: {
        presenceStatus: dto.presenceStatus,
        presenceMessage: dto.presenceMessage,
        currentProjectId: dto.currentProjectId,
        lastSeenAt: new Date(),
      },
      create: {
        organisationId,
        userId,
        presenceStatus: dto.presenceStatus,
        presenceMessage: dto.presenceMessage,
        currentProjectId: dto.currentProjectId,
        lastSeenAt: new Date(),
      },
    });
    this.realtime.emitPresence(organisationId, presence);
    return presence;
  }
}
