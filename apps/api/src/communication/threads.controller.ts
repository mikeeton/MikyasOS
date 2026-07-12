import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { CreateThreadDto, IdParamDto } from './dto/communication.dto';
import { ThreadsService } from './threads.service';

@Controller({ path: 'threads', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class ThreadsController {
  constructor(private readonly threads: ThreadsService) {}

  @Get('conversation/:id')
  @RequirePermissions('Communication.Read')
  list(@CurrentOrganisation() organisationId: string, @Param() params: IdParamDto) {
    return this.threads.list(organisationId, params.id);
  }

  @Post()
  @RequirePermissions('Communication.Write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateThreadDto,
  ) {
    return this.threads.create(organisationId, user.id, dto);
  }
}
