import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { HealthModule } from '../health/health.module';
import { DatabaseModule } from '../infra/database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';

@Module({
  imports: [DatabaseModule, HealthModule, JwtModule.register({}), PermissionsModule],
  controllers: [PlatformController],
  providers: [PlatformService, JwtAuthGuard, OrganisationGuard, PermissionsGuard],
  exports: [PlatformService],
})
export class PlatformModule {}

export class ObservabilityModule {}
export class MetricsModule {}
export class TracingModule {}
export class ReliabilityModule {}
export class BackupModule {}
export class RecoveryModule {}
export class FeatureFlagsModule {}
export class DeploymentModule {}
export class JobMonitoringModule {}
export class CostMonitoringModule {}
export class IncidentModule {}
export class StatusModule {}
