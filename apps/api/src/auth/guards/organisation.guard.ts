import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../infra/database/prisma.service';
import type { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class OrganisationGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const organisationId =
      request.headers['x-organisation-id']?.toString() ?? user?.activeOrganisationId ?? undefined;

    if (!user || !organisationId) {
      throw new ForbiddenException('An active organisation is required.');
    }

    const member = await this.prisma.organisationMember.findFirst({
      where: {
        organisationId,
        userId: user.id,
        deletedAt: null,
        organisation: { deletedAt: null },
      },
      select: { id: true },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this organisation.');
    }

    request.organisationId = organisationId;
    return true;
  }
}
