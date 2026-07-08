import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [JwtModule.register({}), AuditLogsModule, PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, JwtAuthGuard, OrganisationGuard, PermissionsGuard],
  exports: [RolesService],
})
export class RolesModule {}
