import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsModule } from '../../permissions/permissions.module';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { CustomerActivitiesModule } from '../customer-activities.module';
import { CompaniesController } from './companies.controller';
import { CompaniesRepository } from './companies.repository';
import { CompaniesService } from './companies.service';

@Module({
  imports: [JwtModule.register({}), AuditLogsModule, CustomerActivitiesModule, PermissionsModule],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    CompaniesRepository,
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
  ],
  exports: [CompaniesService, CompaniesRepository],
})
export class CompaniesModule {}
