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
  CreateMessageDto,
  IdParamDto,
  ListCommunicationDto,
  ReactToMessageDto,
  UpdateMessageDto,
} from './dto/communication.dto';
import { MessagesService } from './messages.service';

@Controller({ path: 'messages', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get('conversation/:id')
  @RequirePermissions('Communication.Read')
  list(
    @CurrentOrganisation() organisationId: string,
    @Param() params: IdParamDto,
    @Query() query: ListCommunicationDto,
  ) {
    return this.messages.list(organisationId, params.id, query);
  }

  @Post()
  @RequirePermissions('Communication.Write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messages.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Communication.Write')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: UpdateMessageDto,
  ) {
    return this.messages.update(organisationId, user.id, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('Communication.Write')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
  ) {
    return this.messages.remove(organisationId, user.id, params.id);
  }

  @Post(':id/reactions')
  @RequirePermissions('Communication.Write')
  react(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: ReactToMessageDto,
  ) {
    return this.messages.react(organisationId, user.id, params.id, dto);
  }

  @Post(':id/read')
  @RequirePermissions('Communication.Read')
  read(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
  ) {
    return this.messages.markRead(organisationId, user.id, params.id);
  }
}
