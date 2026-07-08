import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { IsUUID } from 'class-validator';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import { CustomerNotesService } from './customer-notes.service';
import { CreateCustomerNoteDto } from './dto/create-customer-note.dto';

class CrmIdParam {
  @IsUUID()
  id!: string;
}

@Controller({ path: 'customer-notes', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class CustomerNotesController {
  constructor(private readonly notes: CustomerNotesService) {}

  @Get()
  @RequirePermissions('crm:read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListCrmRecordsDto) {
    return this.notes.list(organisationId, query);
  }

  @Post()
  @RequirePermissions('crm:write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCustomerNoteDto,
  ) {
    return this.notes.create(organisationId, user.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('crm:delete')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: CrmIdParam,
  ) {
    return this.notes.remove(organisationId, user.id, params.id);
  }
}
