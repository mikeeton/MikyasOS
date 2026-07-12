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
  CreateMeetingNoteDto,
  IdParamDto,
  ListCommunicationDto,
  UpdateMeetingNoteDto,
} from './dto/communication.dto';
import { MeetingNotesService } from './meeting-notes.service';

@Controller({ path: 'meeting-notes', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class MeetingNotesController {
  constructor(private readonly notes: MeetingNotesService) {}

  @Get()
  @RequirePermissions('Meetings.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListCommunicationDto) {
    return this.notes.list(organisationId, query);
  }

  @Post()
  @RequirePermissions('Meetings.Write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMeetingNoteDto,
  ) {
    return this.notes.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Meetings.Write')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: UpdateMeetingNoteDto,
  ) {
    return this.notes.update(organisationId, user.id, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('Meetings.Write')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
  ) {
    return this.notes.remove(organisationId, user.id, params.id);
  }
}
