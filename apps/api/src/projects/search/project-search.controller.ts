import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { ProjectSearchDto } from './dto/project-search.dto';
import { ProjectSearchService } from './project-search.service';

@Controller({ path: 'project-search', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class ProjectSearchController {
  constructor(private readonly searchService: ProjectSearchService) {}

  @Get()
  @RequirePermissions('Project.Read')
  search(@CurrentOrganisation() organisationId: string, @Query() query: ProjectSearchDto) {
    return this.searchService.search(organisationId, query);
  }
}
