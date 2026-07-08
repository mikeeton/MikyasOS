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
import { BulkDeleteDto } from '../dto/bulk-delete.dto';
import { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

class CrmIdParam {
  @IsUUID()
  id!: string;
}

@Controller({ path: 'companies', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Get()
  @RequirePermissions('crm:read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListCrmRecordsDto) {
    return this.companies.list(organisationId, query);
  }

  @Get(':id')
  @RequirePermissions('crm:read')
  findOne(@CurrentOrganisation() organisationId: string, @Param() params: CrmIdParam) {
    return this.companies.findOne(organisationId, params.id);
  }

  @Post()
  @RequirePermissions('crm:write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCompanyDto,
  ) {
    return this.companies.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('crm:write')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: CrmIdParam,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companies.update(organisationId, user.id, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('crm:delete')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: CrmIdParam,
  ) {
    return this.companies.remove(organisationId, user.id, params.id);
  }

  @Post('bulk-delete')
  @RequirePermissions('crm:delete')
  bulkDelete(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: BulkDeleteDto,
  ) {
    return this.companies.bulkDelete(organisationId, user.id, dto);
  }
}
