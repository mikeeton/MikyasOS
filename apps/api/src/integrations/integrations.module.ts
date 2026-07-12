import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { DatabaseModule } from '../infra/database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { ConnectorRegistryService } from './connector-registry.service';
import {
  AutomationSuggestionService,
  ConnectorHealthService,
  CredentialAnalysisService,
  IntegrationRecommendationService,
  SyncOptimisationService,
} from './integrations-ai.service';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

@Module({
  imports: [DatabaseModule, JwtModule.register({}), PermissionsModule, AuditLogsModule],
  controllers: [IntegrationsController],
  providers: [
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
    ConnectorRegistryService,
    IntegrationsService,
    IntegrationRecommendationService,
    SyncOptimisationService,
    ConnectorHealthService,
    CredentialAnalysisService,
    AutomationSuggestionService,
  ],
  exports: [IntegrationsService, ConnectorRegistryService],
})
export class IntegrationsModule {}

export class ConnectorModule {}
export class WebhookModule {}
export class OAuthModule {}
export class SyncEngineModule {}
export class MarketplaceModule {}
export class CredentialsModule {}
export class IntegrationLogsModule {}
export class IntegrationHealthModule {}
export class ConnectorRegistryModule {}
