import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { CrmSearchDto } from './dto/crm-search.dto';
import { CrmSearchService } from './crm-search.service';

@Controller({ path: 'crm/search', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class CrmSearchController {
  constructor(private readonly searchService: CrmSearchService) {}

  @Get()
  @RequirePermissions('crm:read')
  search(@CurrentOrganisation() organisationId: string, @Query() query: CrmSearchDto) {
    return this.searchService.search(organisationId, query);
  }
}
