import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PermissionsService } from '../../permissions/permissions.service';
import { PERMISSION_METADATA_KEY } from '../auth.constants';
import type { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissions: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSION_METADATA_KEY, [
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

    const hasPermissions = await this.permissions.userHasPermissions(
      request.user.id,
      organisationId,
      required,
    );

    if (!hasPermissions) {
      throw new ForbiddenException('You do not have the required permissions.');
    }

    return true;
  }
}
