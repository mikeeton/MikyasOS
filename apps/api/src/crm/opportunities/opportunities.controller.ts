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
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunitiesService } from './opportunities.service';

class CrmIdParam {
  @IsUUID()
  id!: string;
}

@Controller({ path: 'opportunities', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class OpportunitiesController {
  constructor(private readonly opportunities: OpportunitiesService) {}

  @Get()
  @RequirePermissions('crm:read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListCrmRecordsDto) {
    return this.opportunities.list(organisationId, query);
  }

  @Get(':id')
  @RequirePermissions('crm:read')
  findOne(@CurrentOrganisation() organisationId: string, @Param() params: CrmIdParam) {
    return this.opportunities.findOne(organisationId, params.id);
  }

  @Post()
  @RequirePermissions('crm:write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOpportunityDto,
  ) {
    return this.opportunities.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('crm:write')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: CrmIdParam,
    @Body() dto: UpdateOpportunityDto,
  ) {
    return this.opportunities.update(organisationId, user.id, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('crm:delete')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: CrmIdParam,
  ) {
    return this.opportunities.remove(organisationId, user.id, params.id);
  }
}
