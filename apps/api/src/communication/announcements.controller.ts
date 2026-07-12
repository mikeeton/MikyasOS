import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { AnnouncementsService } from './announcements.service';
import {
  CreateAnnouncementDto,
  IdParamDto,
  ListCommunicationDto,
  UpdateAnnouncementDto,
} from './dto/communication.dto';

@Controller({ path: 'announcements', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class AnnouncementsController {
  constructor(private readonly announcements: AnnouncementsService) {}

  @Get()
  @RequirePermissions('Communication.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListCommunicationDto) {
    return this.announcements.list(organisationId, query);
  }

  @Post()
  @RequirePermissions('Announcements.Manage')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAnnouncementDto,
  ) {
    return this.announcements.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Announcements.Manage')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: UpdateAnnouncementDto,
  ) {
    return this.announcements.update(organisationId, user.id, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('Announcements.Manage')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
  ) {
    return this.announcements.remove(organisationId, user.id, params.id);
  }
}
