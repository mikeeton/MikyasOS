import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { OrganisationRoleType } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { ROLE_METADATA_KEY } from '../auth.constants';
import type { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const required = this.reflector.getAllAndOverride<OrganisationRoleType[]>(ROLE_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const organisationId = request.organisationId ?? request.user?.activeOrganisationId;

    if (!request.user || !organisationId) {
      throw new ForbiddenException('An active organisation is required.');
    }

    const member = await this.prisma.organisationMember.findFirst({
      where: { userId: request.user.id, organisationId, deletedAt: null },
      select: { roleType: true },
    });

    if (!member || !required.includes(member.roleType)) {
      throw new ForbiddenException('You do not have the required role.');
    }

    return true;
  }
}
