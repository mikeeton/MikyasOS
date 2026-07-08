import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import { ProjectActivitiesService } from './project-activities.service';

@Controller({ path: 'project-activities', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class ProjectActivitiesController {
  constructor(private readonly activities: ProjectActivitiesService) {}

  @Get()
  @RequirePermissions('Project.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListWorkRecordsDto) {
    return this.activities.list(organisationId, query);
  }
}
