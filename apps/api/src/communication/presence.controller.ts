import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { UpdatePresenceDto } from './dto/communication.dto';
import { PresenceService } from './presence.service';

@Controller({ path: 'presence', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class PresenceController {
  constructor(private readonly presence: PresenceService) {}

  @Get()
  @RequirePermissions('Communication.Read')
  list(@CurrentOrganisation() organisationId: string) {
    return this.presence.list(organisationId);
  }

  @Patch('me')
  @RequirePermissions('Communication.Write')
  updateMe(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePresenceDto,
  ) {
    return this.presence.update(organisationId, user.id, dto);
  }
}
