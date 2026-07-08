import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { PermissionsService } from './permissions.service';

@Controller({ path: 'permissions', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard)
export class PermissionsController {
  constructor(private readonly permissions: PermissionsService) {}

  @Get('check')
  check(
    @CurrentUser() user: AuthenticatedUser,
    @CurrentOrganisation() organisationId: string,
    @Query('permission') permission: string,
  ) {
    return this.permissions.userHasPermissions(user.id, organisationId, [permission]);
  }
}
