import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import {
  CreateBackupDto,
  CreateDeploymentDto,
  CreateFeatureFlagDto,
  CreateIncidentDto,
  ListPlatformDto,
  RecordCostDto,
  RecordHealthDto,
  RecoveryActionDto,
  SetCircuitBreakerDto,
} from './dto/platform.dto';
import { PlatformService } from './platform.service';

@Controller({ path: 'platform', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class PlatformController {
  constructor(private readonly platform: PlatformService) {}

  @Get('capabilities')
  @RequirePermissions('Platform.Read')
  capabilities() {
    return this.platform.capabilities();
  }

  @Get('overview')
  @RequirePermissions('Platform.Read')
  overview(@CurrentOrganisation() organisationId: string) {
    return this.platform.overview(organisationId);
  }

  @Get('health')
  @RequirePermissions('Platform.Read')
  health(@CurrentOrganisation() organisationId: string, @Query() query: ListPlatformDto) {
    return this.platform.list('platformHealthCheck', organisationId, query);
  }

  @Post('health')
  @RequirePermissions('Platform.Operate')
  recordHealth(@CurrentOrganisation() organisationId: string, @Body() dto: RecordHealthDto) {
    return this.platform.recordHealth(organisationId, dto);
  }

  @Get('incidents')
  @RequirePermissions('Platform.Read')
  incidents(@CurrentOrganisation() organisationId: string, @Query() query: ListPlatformDto) {
    return this.platform.list('incident', organisationId, query);
  }

  @Post('incidents')
  @RequirePermissions('Platform.Manage')
  createIncident(@CurrentOrganisation() organisationId: string, @Body() dto: CreateIncidentDto) {
    return this.platform.createIncident(organisationId, dto);
  }

  @Get('backups')
  @RequirePermissions('Platform.Read')
  backups(@CurrentOrganisation() organisationId: string, @Query() query: ListPlatformDto) {
    return this.platform.list('backupRecord', organisationId, query);
  }

  @Post('backups')
  @RequirePermissions('Platform.Manage')
  createBackup(@CurrentOrganisation() organisationId: string, @Body() dto: CreateBackupDto) {
    return this.platform.createBackup(organisationId, dto);
  }

  @Get('deployments')
  @RequirePermissions('Platform.Read')
  deployments(@CurrentOrganisation() organisationId: string, @Query() query: ListPlatformDto) {
    return this.platform.list('deploymentRecord', organisationId, query);
  }

  @Post('deployments')
  @RequirePermissions('Platform.Manage')
  createDeployment(
    @CurrentOrganisation() organisationId: string,
    @Body() dto: CreateDeploymentDto,
  ) {
    return this.platform.createDeployment(organisationId, dto);
  }

  @Get('feature-flags')
  @RequirePermissions('Platform.Read')
  flags(@CurrentOrganisation() organisationId: string, @Query() query: ListPlatformDto) {
    return this.platform.list('featureFlag', organisationId, query);
  }

  @Post('feature-flags')
  @RequirePermissions('Platform.Manage')
  createFlag(@CurrentOrganisation() organisationId: string, @Body() dto: CreateFeatureFlagDto) {
    return this.platform.createFeatureFlag(organisationId, dto);
  }

  @Get('jobs')
  @RequirePermissions('Platform.Read')
  jobs(@CurrentOrganisation() organisationId: string, @Query() query: ListPlatformDto) {
    return this.platform.list('jobQueueSnapshot', organisationId, query);
  }

  @Get('costs')
  @RequirePermissions('Platform.Read')
  costs(@CurrentOrganisation() organisationId: string, @Query() query: ListPlatformDto) {
    return this.platform.list('costRecord', organisationId, query);
  }

  @Post('costs')
  @RequirePermissions('Platform.Manage')
  recordCost(@CurrentOrganisation() organisationId: string, @Body() dto: RecordCostDto) {
    return this.platform.recordCost(organisationId, dto);
  }

  @Get('circuit-breakers')
  @RequirePermissions('Platform.Read')
  circuitBreakers(@CurrentOrganisation() organisationId: string, @Query() query: ListPlatformDto) {
    return this.platform.list('circuitBreaker', organisationId, query);
  }

  @Post('circuit-breakers')
  @RequirePermissions('Platform.Operate')
  setCircuitBreaker(
    @CurrentOrganisation() organisationId: string,
    @Body() dto: SetCircuitBreakerDto,
  ) {
    return this.platform.setCircuitBreaker(organisationId, dto);
  }

  @Post('recovery-actions')
  @RequirePermissions('Platform.Operate')
  recover(@CurrentOrganisation() organisationId: string, @Body() dto: RecoveryActionDto) {
    return this.platform.safeRecovery(organisationId, dto);
  }
}
