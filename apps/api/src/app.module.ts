import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AutomationModule } from './automation/automation.module';
import { BillingModule } from './billing/billing.module';
import { AppConfigModule } from './config/app-config.module';
import { AppConfigService } from './config/app-config.service';
import { CommunicationModule } from './communication/communication.module';
import { CrmModule } from './crm/crm.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { FinanceModule } from './finance/finance.module';
import { HealthModule } from './health/health.module';
import { AiModule } from './infra/ai/ai.module';
import { AiOsModule } from './ai-os/ai-os.module';
import { DatabaseModule } from './infra/database/database.module';
import { RedisModule } from './infra/redis/redis.module';
import { StorageModule } from './infra/storage/storage.module';
import { DocumentActivitiesModule } from './documents/document-activities.module';
import { DocumentLinksModule } from './documents/document-links.module';
import { DocumentPermissionsModule } from './documents/document-permissions.module';
import { DocumentSearchModule } from './documents/document-search.module';
import { DocumentTagsModule } from './documents/document-tags.module';
import { DocumentVersionsModule } from './documents/document-versions.module';
import { DocumentsModule } from './documents/documents.module';
import { FoldersModule } from './documents/folders.module';
import { InvitationsModule } from './invitations/invitations.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PlatformModule } from './platform/platform.module';
import { ProjectsModule } from './projects/projects.module';
import { RolesModule } from './roles/roles.module';
import { SessionsModule } from './sessions/sessions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: { singleLine: true },
              },
      },
    }),
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        connection: { url: config.redisUrl },
      }),
    }),
    DatabaseModule,
    RedisModule,
    StorageModule,
    AiModule,
    AiOsModule,
    AuthModule,
    BillingModule,
    UsersModule,
    OrganisationsModule,
    RolesModule,
    PermissionsModule,
    AnalyticsModule,
    IntegrationsModule,
    EnterpriseModule,
    PlatformModule,
    AutomationModule,
    CommunicationModule,
    CrmModule,
    FinanceModule,
    ProjectsModule,
    DocumentActivitiesModule,
    DocumentsModule,
    FoldersModule,
    DocumentVersionsModule,
    DocumentPermissionsModule,
    DocumentTagsModule,
    DocumentLinksModule,
    DocumentSearchModule,
    InvitationsModule,
    SessionsModule,
    HealthModule,
  ],
})
export class AppModule {}
