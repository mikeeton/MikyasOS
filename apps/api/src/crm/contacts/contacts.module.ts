import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { PermissionsModule } from '../../permissions/permissions.module';
import { CompaniesModule } from '../companies/companies.module';
import { CustomerActivitiesModule } from '../customer-activities.module';
import { ContactsController } from './contacts.controller';
import { ContactsRepository } from './contacts.repository';
import { ContactsService } from './contacts.service';

@Module({
  imports: [
    JwtModule.register({}),
    AuditLogsModule,
    CompaniesModule,
    CustomerActivitiesModule,
    PermissionsModule,
  ],
  controllers: [ContactsController],
  providers: [
    ContactsService,
    ContactsRepository,
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
  ],
  exports: [ContactsService, ContactsRepository],
})
export class ContactsModule {}
