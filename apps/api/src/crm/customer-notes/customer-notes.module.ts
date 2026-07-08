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
import { CustomerNotesController } from './customer-notes.controller';
import { CustomerNotesRepository } from './customer-notes.repository';
import { CustomerNotesService } from './customer-notes.service';

@Module({
  imports: [
    AuditLogsModule,
    JwtModule.register({}),
    CompaniesModule,
    ContactsModule,
    CustomerActivitiesModule,
    PermissionsModule,
  ],
  controllers: [CustomerNotesController],
  providers: [
    CustomerNotesService,
    CustomerNotesRepository,
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
  ],
  exports: [CustomerNotesService, CustomerNotesRepository],
})
export class CustomerNotesModule {}
