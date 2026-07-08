import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { DatabaseModule } from '../../infra/database/database.module';
import { PermissionsModule } from '../../permissions/permissions.module';
import { CompaniesModule } from '../companies/companies.module';
import { CustomerActivitiesModule } from '../customer-activities.module';
import { LeadsController } from './leads.controller';
import { LeadsRepository } from './leads.repository';
import { LeadsService } from './leads.service';

@Module({
  imports: [
    AuditLogsModule,
    JwtModule.register({}),
    CompaniesModule,
    CustomerActivitiesModule,
    DatabaseModule,
    PermissionsModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService, LeadsRepository, JwtAuthGuard, OrganisationGuard, PermissionsGuard],
  exports: [LeadsService, LeadsRepository],
})
export class LeadsModule {}
