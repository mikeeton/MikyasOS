import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IsUUID } from 'class-validator';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { CustomerTagsService } from './customer-tags.service';
import { AssignCustomerTagDto } from './dto/assign-customer-tag.dto';
import { CreateCustomerTagDto } from './dto/create-customer-tag.dto';

class CrmIdParam {
  @IsUUID()
  id!: string;
}

@Controller({ path: 'customer-tags', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class CustomerTagsController {
  constructor(private readonly tags: CustomerTagsService) {}

  @Get()
  @RequirePermissions('crm:read')
  list(@CurrentOrganisation() organisationId: string) {
    return this.tags.list(organisationId);
  }

  @Post()
  @RequirePermissions('crm:write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCustomerTagDto,
  ) {
    return this.tags.create(organisationId, user.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('crm:delete')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: CrmIdParam,
  ) {
    return this.tags.remove(organisationId, user.id, params.id);
  }

  @Post('assign')
  @RequirePermissions('crm:write')
  assign(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AssignCustomerTagDto,
  ) {
    return this.tags.assign(organisationId, user.id, dto);
  }

  @Post('unassign')
  @RequirePermissions('crm:write')
  unassign(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AssignCustomerTagDto,
  ) {
    return this.tags.unassign(organisationId, user.id, dto);
  }
}
