import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { PermissionsModule } from '../../permissions/permissions.module';
import { CompaniesModule } from '../companies/companies.module';
import { ContactsModule } from '../contacts/contacts.module';
import { CustomerActivitiesModule } from '../customer-activities.module';
import { CustomerFilesController } from './customer-files.controller';
import { CustomerFilesRepository } from './customer-files.repository';
import { CustomerFilesService } from './customer-files.service';

@Module({
  imports: [
    AuditLogsModule,
    JwtModule.register({}),
    CompaniesModule,
    ContactsModule,
    CustomerActivitiesModule,
    PermissionsModule,
  ],
  controllers: [CustomerFilesController],
  providers: [
    CustomerFilesService,
    CustomerFilesRepository,
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
  ],
  exports: [CustomerFilesService, CustomerFilesRepository],
})
export class CustomerFilesModule {}
