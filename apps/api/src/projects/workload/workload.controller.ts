import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { WorkloadService } from './workload.service';

@Controller({ path: 'workload', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class WorkloadController {
  constructor(private readonly workload: WorkloadService) {}

  @Get()
  @RequirePermissions('Project.Read')
  overview(@CurrentOrganisation() organisationId: string) {
    return this.workload.overview(organisationId);
  }
}
