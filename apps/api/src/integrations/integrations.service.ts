import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ConnectionStatus,
  IntegrationEventType,
  IntegrationHealthStatus,
  IntegrationLogSeverity,
  IntegrationStatus,
  Prisma,
  SyncStatus,
  WebhookDeliveryStatus,
} from '@prisma/client';
import { createHash, randomBytes } from 'crypto';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import { ConnectorRegistryService } from './connector-registry.service';
import type {
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

type IntegrationDelegate =
  | 'integration'
  | 'integrationConnection'
  | 'integrationCredential'
  | 'integrationSync'
  | 'webhookEndpoint'
  | 'webhookDelivery'
  | 'syncLog'
  | 'integrationHealth'
  | 'integrationEvent'
  | 'connector'
  | 'aPIKey';

type IntegrationModelDelegate = {
  findMany(args: unknown): Promise<unknown[]>;
  count(args: unknown): Promise<number>;
};

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogsService,
    private readonly registry: ConnectorRegistryService,
  ) {}

  capabilities() {
    return {
      modules: [
        'IntegrationsModule',
        'ConnectorModule',
        'WebhookModule',
        'OAuthModule',
        'SyncEngineModule',
        'MarketplaceModule',
        'CredentialsModule',
        'IntegrationLogsModule',
        'IntegrationHealthModule',
        'ConnectorRegistryModule',
      ],
      supportedIntegrations: this.registry.definitions(),
      oauth: ['OAuth2', 'API Keys', 'Bearer Tokens', 'Basic Authentication', 'Webhook Secrets'],
      syncModes: ['manual', 'scheduled', 'webhook', 'incremental', 'full'],
      productionConnectorsEnabled: false,
    };
  }

  marketplace(organisationId: string) {
    return this.registry.definitions().map((definition) => ({
      ...definition,
      installStatus: 'available',
      organisationId,
    }));
  }

  async list(delegate: IntegrationDelegate, organisationId: string, query: ListIntegrationsDto) {
    const model = this.delegate(delegate);
    const where = this.where(organisationId, query);
    const [items, total] = await Promise.all([
      model.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      model.count({ where }),
    ]);
    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        pageCount: Math.ceil(total / query.pageSize),
        hasNextPage: query.page * query.pageSize < total,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  async install(organisationId: string, actorUserId: string, connectorKey: string) {
    const definition = this.registry.requireDefinition(connectorKey);
    const connector = await this.prisma.connector.upsert({
      where: { organisationId_key: { organisationId, key: definition.key } },
      update: {
        name: definition.name,
        category: definition.category,
        provider: definition.provider,
        authTypes: definition.authTypes,
        verified: definition.verified,
        featured: definition.featured,
        capabilities: { actions: definition.actions },
        status: IntegrationStatus.AVAILABLE,
      },
      create: {
        organisationId,
        key: definition.key,
        name: definition.name,
        category: definition.category,
        provider: definition.provider,
        authTypes: definition.authTypes,
        verified: definition.verified,
        featured: definition.featured,
        capabilities: { actions: definition.actions },
        documentation: definition.description,
      },
    });
    const integration = await this.prisma.integration.upsert({
      where: { organisationId_key: { organisationId, key: definition.key } },
      update: { status: IntegrationStatus.INSTALLED, connectorId: connector.id },
      create: {
        organisationId,
        connectorId: connector.id,
        key: definition.key,
        name: definition.name,
        category: definition.category,
        provider: definition.provider,
        status: IntegrationStatus.INSTALLED,
        createdById: actorUserId,
        config: { productionConnectorExecution: false },
      },
    });
    await this.event(
      organisationId,
      actorUserId,
      IntegrationEventType.INSTALLED,
      integration.id,
      'integration',
      integration.id,
    );
    return integration;
  }

  async createIntegration(
    organisationId: string,
    actorUserId: string,
    dto: CreateIntegrationDto,
  ) {
    const integration = await this.prisma.integration.create({
      data: {
        organisationId,
        createdById: actorUserId,
        connectorId: dto.connectorId,
        key: dto.key,
        name: dto.name,
        category: dto.category,
        provider: dto.provider,
        config: (dto.config ?? {}) as Prisma.InputJsonValue,
      },
    });
    await this.event(
      organisationId,
      actorUserId,
      IntegrationEventType.INSTALLED,
      integration.id,
      'integration',
      integration.id,
    );
    return integration;
  }

  async createCredential(
    organisationId: string,
    actorUserId: string,
    dto: CreateCredentialDto,
  ) {
    await this.assertIntegration(organisationId, dto.integrationId);
    const encryptedData = this.encryptPlaceholder(dto.secret);
    const credential = await this.prisma.integrationCredential.create({
      data: {
        organisationId,
        integrationId: dto.integrationId,
        authType: dto.authType,
        label: dto.label,
        encryptedData,
        fingerprint: this.fingerprint(dto.secret),
        createdById: actorUserId,
      },
    });
    await this.event(
      organisationId,
      actorUserId,
      IntegrationEventType.CREDENTIAL_ROTATED,
      dto.integrationId,
      'integrationCredential',
      credential.id,
    );
    return { ...credential, encryptedData: { redacted: true } };
  }

  async createConnection(
    organisationId: string,
    actorUserId: string,
    dto: CreateConnectionDto,
  ) {
    await this.assertIntegration(organisationId, dto.integrationId);
    const connection = await this.prisma.integrationConnection.create({
      data: {
        organisationId,
        integrationId: dto.integrationId,
        credentialId: dto.credentialId,
        status: dto.status ?? ConnectionStatus.CONNECTED,
        scopes: dto.scopes ?? [],
        metadata: (dto.metadata ?? {}) as Prisma.InputJsonValue,
        connectedAt: new Date(),
      },
    });
    await this.event(
      organisationId,
      actorUserId,
      IntegrationEventType.CONNECTED,
      dto.integrationId,
      'integrationConnection',
      connection.id,
    );
    return connection;
  }

  async startSync(organisationId: string, actorUserId: string, dto: StartSyncDto) {
    await this.assertIntegration(organisationId, dto.integrationId);
    const sync = await this.prisma.integrationSync.create({
      data: {
        organisationId,
        integrationId: dto.integrationId,
        connectionId: dto.connectionId,
        mode: dto.mode,
        entity: dto.entity,
        status: SyncStatus.RUNNING,
        startedAt: new Date(),
        checkpoint: { architecture: 'incremental checkpoints prepared' },
      },
    });
    await this.log(organisationId, {
      integrationId: dto.integrationId,
      syncId: sync.id,
      severity: IntegrationLogSeverity.INFO,
      message: `Sync started for ${dto.entity}.`,
    });
    await this.event(
      organisationId,
      actorUserId,
      IntegrationEventType.SYNC_STARTED,
      dto.integrationId,
      'integrationSync',
      sync.id,
    );
    return sync;
  }

  async completeSync(organisationId: string, actorUserId: string, syncId: string) {
    const sync = await this.prisma.integrationSync.findFirst({
      where: { id: syncId, organisationId, deletedAt: null },
    });
    if (!sync) throw new NotFoundException('Sync was not found.');
    const completed = await this.prisma.integrationSync.update({
      where: { id: syncId },
      data: {
        status: SyncStatus.COMPLETED,
        completedAt: new Date(),
        summary: { recordsRead: 0, recordsWritten: 0, conflicts: 0 },
      },
    });
    await this.log(organisationId, {
      integrationId: sync.integrationId,
      syncId,
      severity: IntegrationLogSeverity.INFO,
      message: 'Sync completed by architecture runner.',
    });
    await this.event(
      organisationId,
      actorUserId,
      IntegrationEventType.SYNC_COMPLETED,
      sync.integrationId,
      'integrationSync',
      syncId,
    );
    return completed;
  }

  async createWebhookEndpoint(organisationId: string, dto: CreateWebhookEndpointDto) {
    if (dto.integrationId) await this.assertIntegration(organisationId, dto.integrationId);
    return this.prisma.webhookEndpoint.create({
      data: {
        organisationId,
        integrationId: dto.integrationId,
        name: dto.name,
        direction: dto.direction,
        url: dto.url,
        events: dto.events ?? [],
        active: dto.active ?? true,
        secretHash: this.hash(randomBytes(16).toString('hex')),
      },
    });
  }

  async receiveWebhook(organisationId: string, endpointId: string, dto: ReceiveWebhookDto) {
    const endpoint = await this.prisma.webhookEndpoint.findFirst({
      where: { id: endpointId, organisationId, deletedAt: null },
    });
    if (!endpoint) throw new NotFoundException('Webhook endpoint was not found.');
    const delivery = await this.prisma.webhookDelivery.create({
      data: {
        organisationId,
        integrationId: endpoint.integrationId,
        endpointId,
        event: dto.event,
        payload: (dto.payload ?? {}) as Prisma.InputJsonValue,
        status: WebhookDeliveryStatus.DELIVERED,
        deliveredAt: new Date(),
        attempts: 1,
      },
    });
    await this.event(
      organisationId,
      undefined,
      IntegrationEventType.WEBHOOK_RECEIVED,
      endpoint.integrationId,
      'webhookDelivery',
      delivery.id,
    );
    return delivery;
  }

  async healthCheck(organisationId: string, integrationId: string) {
    const integration = await this.assertIntegration(organisationId, integrationId);
    const connector = integration.key ? this.registry.get(integration.key) : null;
    const result = connector
      ? await connector.healthCheck({ organisationId, integrationId })
      : { ok: true, message: 'Custom connector health architecture ready.' };
    return this.prisma.integrationHealth.create({
      data: {
        organisationId,
        integrationId,
        status: result.ok ? IntegrationHealthStatus.HEALTHY : IntegrationHealthStatus.DEGRADED,
        details: result as Prisma.InputJsonValue,
        latencyMs: 0,
      },
    });
  }

  async createApiKey(organisationId: string, actorUserId: string, dto: CreateApiKeyDto) {
    const raw = `mks_${randomBytes(24).toString('hex')}`;
    const key = await this.prisma.aPIKey.create({
      data: {
        organisationId,
        integrationId: dto.integrationId,
        name: dto.name,
        keyHash: this.hash(raw),
        prefix: raw.slice(0, 8),
        scopes: dto.scopes ?? [],
        createdById: actorUserId,
      },
    });
    return { ...key, token: raw };
  }

  log(organisationId: string, dto: CreateLogDto) {
    return this.prisma.syncLog.create({
      data: {
        organisationId,
        integrationId: dto.integrationId,
        syncId: dto.syncId,
        severity: dto.severity ?? IntegrationLogSeverity.INFO,
        message: dto.message,
        metadata: (dto.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }

  oauthArchitecture(provider: string) {
    return {
      provider,
      authorizationUrl: `/api/v1/integrations/oauth/${provider}/authorize`,
      callbackUrl: `/api/v1/integrations/oauth/${provider}/callback`,
      pkceRequired: true,
      tokenStorage: 'IntegrationCredential.encryptedData',
      productionOAuthEnabled: false,
    };
  }

  private async assertIntegration(organisationId: string, id: string) {
    const integration = await this.prisma.integration.findFirst({
      where: { id, organisationId, deletedAt: null },
    });
    if (!integration) throw new NotFoundException('Integration was not found.');
    return integration;
  }

  private delegate(delegate: IntegrationDelegate) {
    return (this.prisma as unknown as Record<IntegrationDelegate, IntegrationModelDelegate>)[
      delegate
    ];
  }

  private where(organisationId: string, query: ListIntegrationsDto) {
    return {
      organisationId,
      deletedAt: null,
      ...(query.category ? { category: query.category } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {}),
    };
  }

  private encryptPlaceholder(secret: Record<string, unknown>) {
    return {
      algorithm: 'local-dev-placeholder',
      ciphertext: Buffer.from(JSON.stringify(secret)).toString('base64'),
      productionEncryptionRequired: true,
    };
  }

  private fingerprint(secret: Record<string, unknown>) {
    return this.hash(JSON.stringify(secret)).slice(0, 16);
  }

  private hash(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private async event(
    organisationId: string,
    actorUserId: string | undefined,
    type: IntegrationEventType,
    integrationId: string | null | undefined,
    entityType: string,
    entityId: string,
  ) {
    await this.prisma.integrationEvent.create({
      data: { organisationId, actorUserId, type, integrationId, entityType, entityId },
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: `integration.${type.toLowerCase()}`,
      entityType,
      entityId,
    });
  }
}
