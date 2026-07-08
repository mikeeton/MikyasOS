import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RolesService } from './roles.service';

@Controller({ path: 'roles', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard)
export class RolesController {
  constructor(private readonly roles: RolesService) {}

  @Get()
  list(@CurrentOrganisation() organisationId: string) {
    return this.roles.list(organisationId);
  }

  @Post('assign')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('roles:assign')
  assign(
    @CurrentUser() user: AuthenticatedUser,
    @CurrentOrganisation() organisationId: string,
    @Body() dto: AssignRoleDto,
  ) {
    return this.roles.assign(organisationId, user.id, dto);
  }
}
