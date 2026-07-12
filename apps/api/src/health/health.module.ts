import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { DatabaseModule } from '../infra/database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { RedisModule } from '../infra/redis/redis.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [DatabaseModule, RedisModule, JwtModule.register({}), PermissionsModule],
  controllers: [HealthController],
  providers: [HealthService, JwtAuthGuard, OrganisationGuard, PermissionsGuard],
  exports: [HealthService],
})
export class HealthModule {}
