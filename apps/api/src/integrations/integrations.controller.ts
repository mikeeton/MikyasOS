import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { ConnectorRegistryService } from './connector-registry.service';
import {
  AutomationSuggestionService,
  ConnectorHealthService,
  CredentialAnalysisService,
  IntegrationRecommendationService,
  SyncOptimisationService,
} from './integrations-ai.service';
import { IntegrationsService } from './integrations.service';
import {
  CreateApiKeyDto,
  CreateConnectionDto,
  CreateCredentialDto,
  CreateIntegrationDto,
  CreateLogDto,
  CreateWebhookEndpointDto,
  ListIntegrationsDto,
  ReceiveWebhookDto,
  StartSyncDto,
} from './dto/integrations.dto';

@Controller({ path: 'integrations', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class IntegrationsController {
  constructor(
    private readonly integrations: IntegrationsService,
    private readonly registry: ConnectorRegistryService,
    private readonly recommendations: IntegrationRecommendationService,
    private readonly syncOptimisation: SyncOptimisationService,
    private readonly connectorHealth: ConnectorHealthService,
    private readonly credentialAnalysis: CredentialAnalysisService,
    private readonly automationSuggestion: AutomationSuggestionService,
  ) {}

  @Get('capabilities')
  @RequirePermissions('Integrations.Read')
  capabilities() {
    return {
      ...this.integrations.capabilities(),
      aiPreparation: {
        recommendations: this.recommendations.getArchitecture(),
        syncOptimisation: this.syncOptimisation.getArchitecture(),
        connectorHealth: this.connectorHealth.getArchitecture(),
        credentialAnalysis: this.credentialAnalysis.getArchitecture(),
        automationSuggestion: this.automationSuggestion.getArchitecture(),
      },
    };
  }

  @Get('marketplace')
  @RequirePermissions('Integrations.Read')
  marketplace(@CurrentOrganisation() organisationId: string) {
    return this.integrations.marketplace(organisationId);
  }

  @Get('registry')
  @RequirePermissions('Integrations.Read')
  registryDefinitions() {
    return { connectors: this.registry.definitions(), categories: this.registry.categories() };
  }

  @Get()
  @RequirePermissions('Integrations.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListIntegrationsDto) {
    return this.integrations.list('integration', organisationId, query);
  }

  @Post()
  @RequirePermissions('Integrations.Write')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateIntegrationDto,
  ) {
    return this.integrations.createIntegration(organisationId, user.id, dto);
  }

  @Post('marketplace/:connectorKey/install')
  @RequirePermissions('Integrations.Write')
  install(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param('connectorKey') connectorKey: string,
  ) {
    return this.integrations.install(organisationId, user.id, connectorKey);
  }

  @Get('connections')
  @RequirePermissions('Integrations.Read')
  connections(@CurrentOrganisation() organisationId: string, @Query() query: ListIntegrationsDto) {
    return this.integrations.list('integrationConnection', organisationId, query);
  }

  @Post('connections')
  @RequirePermissions('Integrations.Write')
  createConnection(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateConnectionDto,
  ) {
    return this.integrations.createConnection(organisationId, user.id, dto);
  }

  @Get('credentials')
  @RequirePermissions('Integrations.Manage')
  credentials(@CurrentOrganisation() organisationId: string, @Query() query: ListIntegrationsDto) {
    return this.integrations.list('integrationCredential', organisationId, query);
  }

  @Post('credentials')
  @RequirePermissions('Integrations.Manage')
  createCredential(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCredentialDto,
  ) {
    return this.integrations.createCredential(organisationId, user.id, dto);
  }

  @Get('syncs')
  @RequirePermissions('Integrations.Read')
  syncs(@CurrentOrganisation() organisationId: string, @Query() query: ListIntegrationsDto) {
    return this.integrations.list('integrationSync', organisationId, query);
  }

  @Post('syncs')
  @RequirePermissions('Integrations.Sync')
  startSync(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StartSyncDto,
  ) {
    return this.integrations.startSync(organisationId, user.id, dto);
  }

  @Post('syncs/:id/complete')
  @RequirePermissions('Integrations.Sync')
  completeSync(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.integrations.completeSync(organisationId, user.id, id);
  }

  @Get('webhooks')
  @RequirePermissions('Integrations.Read')
  webhooks(@CurrentOrganisation() organisationId: string, @Query() query: ListIntegrationsDto) {
    return this.integrations.list('webhookEndpoint', organisationId, query);
  }

  @Post('webhooks')
  @RequirePermissions('Integrations.Manage')
  createWebhook(
    @CurrentOrganisation() organisationId: string,
    @Body() dto: CreateWebhookEndpointDto,
  ) {
    return this.integrations.createWebhookEndpoint(organisationId, dto);
  }

  @Post('webhooks/:id/receive')
  @RequirePermissions('Integrations.Webhooks')
  receiveWebhook(
    @CurrentOrganisation() organisationId: string,
    @Param('id') id: string,
    @Body() dto: ReceiveWebhookDto,
  ) {
    return this.integrations.receiveWebhook(organisationId, id, dto);
  }

  @Get('logs')
  @RequirePermissions('Integrations.Read')
  logs(@CurrentOrganisation() organisationId: string, @Query() query: ListIntegrationsDto) {
    return this.integrations.list('syncLog', organisationId, query);
  }

  @Post('logs')
  @RequirePermissions('Integrations.Write')
  createLog(@CurrentOrganisation() organisationId: string, @Body() dto: CreateLogDto) {
    return this.integrations.log(organisationId, dto);
  }

  @Get('health')
  @RequirePermissions('Integrations.Read')
  health(@CurrentOrganisation() organisationId: string, @Query() query: ListIntegrationsDto) {
    return this.integrations.list('integrationHealth', organisationId, query);
  }

  @Post(':id/health-check')
  @RequirePermissions('Integrations.Read')
  healthCheck(@CurrentOrganisation() organisationId: string, @Param('id') id: string) {
    return this.integrations.healthCheck(organisationId, id);
  }

  @Post('api-keys')
  @RequirePermissions('Integrations.Manage')
  createApiKey(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.integrations.createApiKey(organisationId, user.id, dto);
  }

  @Get('oauth/:provider/architecture')
  @RequirePermissions('Integrations.Read')
  oauth(@Param('provider') provider: string) {
    return this.integrations.oauthArchitecture(provider);
  }
}
