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
import { IsUUID } from 'class-validator';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

class CrmIdParam {
  @IsUUID()
  id!: string;
}

@Controller({ path: 'contacts', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class ContactsController {
  constructor(private readonly contacts: ContactsService) {}

  @Get()
  @RequirePermissions('crm:read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListCrmRecordsDto) {
    return this.contacts.list(organisationId, query);
  }

  @Get(':id')
  @RequirePermissions('crm:read')
  findOne(@CurrentOrganisation() organisationId: string, @Param() params: CrmIdParam) {
    return this.contacts.findOne(organisationId, params.id);
  }

  @Post()
  @RequirePermissions('crm:write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateContactDto,
  ) {
    return this.contacts.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('crm:write')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: CrmIdParam,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contacts.update(organisationId, user.id, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('crm:delete')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: CrmIdParam,
  ) {
    return this.contacts.remove(organisationId, user.id, params.id);
  }
}
