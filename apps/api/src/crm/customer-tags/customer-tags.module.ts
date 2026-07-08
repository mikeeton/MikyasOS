import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { PermissionsModule } from '../../permissions/permissions.module';
import { CompaniesModule } from '../companies/companies.module';
import { CustomerActivitiesModule } from '../customer-activities.module';
import { CustomerTagsController } from './customer-tags.controller';
import { CustomerTagsRepository } from './customer-tags.repository';
import { CustomerTagsService } from './customer-tags.service';

@Module({
  imports: [
    JwtModule.register({}),
    AuditLogsModule,
    CompaniesModule,
    CustomerActivitiesModule,
    PermissionsModule,
  ],
  controllers: [CustomerTagsController],
  providers: [
    CustomerTagsService,
    CustomerTagsRepository,
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
  ],
  exports: [CustomerTagsService, CustomerTagsRepository],
})
export class CustomerTagsModule {}
