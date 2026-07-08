import { Module } from '@nestjs/common';

import { DatabaseModule } from '../infra/database/database.module';
import { CrmAiModule } from './ai/crm-ai.module';
import { CompaniesModule } from './companies/companies.module';
import { ContactsModule } from './contacts/contacts.module';
import { CustomerActivitiesModule } from './customer-activities.module';
import { CustomerFilesModule } from './customer-files/customer-files.module';
import { CustomerNotesModule } from './customer-notes/customer-notes.module';
import { CustomerTagsModule } from './customer-tags/customer-tags.module';
import { LeadsModule } from './leads/leads.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { CrmSearchModule } from './search/crm-search.module';

@Module({
  imports: [
    DatabaseModule,
    CustomerActivitiesModule,
    CompaniesModule,
    ContactsModule,
    LeadsModule,
    OpportunitiesModule,
    CustomerNotesModule,
    CustomerFilesModule,
    CustomerTagsModule,
    CrmSearchModule,
    CrmAiModule,
  ],
})
export class CrmModule {}
