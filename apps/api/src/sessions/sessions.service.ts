import { Injectable } from '@nestjs/common';

import { PrismaService } from '../infra/database/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, organisationId: string | null, expiresAt: Date) {
    return this.prisma.session.create({
      data: { userId, organisationId, expiresAt },
    });
  }

  revoke(sessionId: string) {
    return this.prisma.session.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
