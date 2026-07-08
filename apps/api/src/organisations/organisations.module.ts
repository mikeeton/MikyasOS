import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsModule } from '../permissions/permissions.module';
import { OrganisationsController } from './organisations.controller';
import { OrganisationsService } from './organisations.service';

@Module({
  imports: [JwtModule.register({}), AuditLogsModule, PermissionsModule],
  controllers: [OrganisationsController],
  providers: [OrganisationsService, JwtAuthGuard],
  exports: [OrganisationsService],
})
export class OrganisationsModule {}
