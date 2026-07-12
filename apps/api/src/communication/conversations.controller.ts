import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { ConversationsService } from './conversations.service';
import {
  CreateConversationDto,
  IdParamDto,
  ListCommunicationDto,
  UpdateConversationDto,
} from './dto/communication.dto';

@Controller({ path: 'conversations', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class ConversationsController {
  constructor(private readonly conversations: ConversationsService) {}

  @Get()
  @RequirePermissions('Communication.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListCommunicationDto) {
    return this.conversations.list(organisationId, query);
  }

  @Get(':id')
  @RequirePermissions('Communication.Read')
  findOne(@CurrentOrganisation() organisationId: string, @Param() params: IdParamDto) {
    return this.conversations.findOne(organisationId, params.id);
  }

  @Post()
  @RequirePermissions('Communication.Write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversations.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Communication.Manage')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.conversations.update(organisationId, user.id, params.id, dto);
  }

  @Post(':id/archive')
  @RequirePermissions('Communication.Manage')
  archive(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
  ) {
    return this.conversations.archive(organisationId, user.id, params.id, true);
  }

  @Post(':id/restore')
  @RequirePermissions('Communication.Manage')
  restore(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
  ) {
    return this.conversations.archive(organisationId, user.id, params.id, false);
  }
}
