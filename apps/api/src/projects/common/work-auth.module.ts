import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { DatabaseModule } from '../../infra/database/database.module';
import { PermissionsModule } from '../../permissions/permissions.module';
import { WorkRelationsService } from './work-relations.service';

@Module({
  imports: [AuditLogsModule, DatabaseModule, JwtModule.register({}), PermissionsModule],
  providers: [JwtAuthGuard, OrganisationGuard, PermissionsGuard, WorkRelationsService],
  exports: [
    AuditLogsModule,
    DatabaseModule,
    JwtModule,
    PermissionsModule,
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
    WorkRelationsService,
  ],
})
export class WorkAuthModule {}
