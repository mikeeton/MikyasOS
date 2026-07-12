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
import {
  CreateMeetingDto,
  IdParamDto,
  ListCommunicationDto,
  UpdateMeetingDto,
} from './dto/communication.dto';
import { MeetingsService } from './meetings.service';

@Controller({ path: 'meetings', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class MeetingsController {
  constructor(private readonly meetings: MeetingsService) {}

  @Get()
  @RequirePermissions('Meetings.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListCommunicationDto) {
    return this.meetings.list(organisationId, query);
  }

  @Get(':id')
  @RequirePermissions('Meetings.Read')
  findOne(@CurrentOrganisation() organisationId: string, @Param() params: IdParamDto) {
    return this.meetings.findOne(organisationId, params.id);
  }

  @Post()
  @RequirePermissions('Meetings.Write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMeetingDto,
  ) {
    return this.meetings.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Meetings.Write')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: UpdateMeetingDto,
  ) {
    return this.meetings.update(organisationId, user.id, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('Meetings.Write')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
  ) {
    return this.meetings.remove(organisationId, user.id, params.id);
  }
}
