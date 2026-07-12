import { Controller, Get, UseGuards } from '@nestjs/common';

import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { HealthService } from './health.service';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.check();
  }

  @Get('live')
  live() {
    return this.healthService.live();
  }

  @Get('ready')
  ready() {
    return this.healthService.ready();
  }

  @Get('details')
  @UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
  @RequirePermissions('Platform.Read')
  details() {
    return this.healthService.details();
  }
}
