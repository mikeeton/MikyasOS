import {
  IntegrationAuthType,
  IntegrationCategory,
  IntegrationEventType,
  IntegrationLogSeverity,
  SyncMode,
  SyncStatus,
  WebhookDirection,
  WebhookDeliveryStatus,
} from '@prisma/client';

import { ConnectorRegistryService } from './connector-registry.service';
import { IntegrationsService } from './integrations.service';

describe('IntegrationsService', () => {
  function service(prismaOverrides: Record<string, unknown> = {}) {
    const audit = { record: jest.fn().mockResolvedValue({ id: 'audit-id' }) };
    const prisma = {
      connector: {
        upsert: jest.fn().mockResolvedValue({ id: 'connector-id', key: 'slack' }),
      },
      integration: {
        upsert: jest.fn().mockResolvedValue({ id: 'integration-id', key: 'slack' }),
        create: jest.fn().mockResolvedValue({ id: 'custom-id', key: 'custom' }),
        findFirst: jest.fn().mockResolvedValue({ id: 'integration-id', key: 'slack' }),
      },
      integrationCredential: {
        create: jest.fn().mockResolvedValue({
          id: 'credential-id',
          encryptedData: { ciphertext: 'secret' },
        }),
      },
      integrationConnection: {
        create: jest.fn().mockResolvedValue({ id: 'connection-id' }),
      },
      integrationSync: {
        create: jest.fn().mockResolvedValue({
          id: 'sync-id',
          integrationId: 'integration-id',
          status: SyncStatus.RUNNING,
        }),
        findFirst: jest.fn().mockResolvedValue({ id: 'sync-id', integrationId: 'integration-id' }),
        update: jest.fn().mockResolvedValue({ id: 'sync-id', status: SyncStatus.COMPLETED }),
      },
      syncLog: {
        create: jest.fn().mockResolvedValue({ id: 'log-id' }),
      },
      webhookEndpoint: {
        create: jest.fn().mockResolvedValue({ id: 'endpoint-id' }),
        findFirst: jest.fn().mockResolvedValue({
          id: 'endpoint-id',
          integrationId: 'integration-id',
        }),
      },
      webhookDelivery: {
        create: jest.fn().mockResolvedValue({ id: 'delivery-id' }),
      },
      integrationHealth: {
        create: jest.fn().mockResolvedValue({ id: 'health-id' }),
      },
      integrationEvent: {
        create: jest.fn().mockResolvedValue({ id: 'event-id' }),
      },
      aPIKey: {
        create: jest.fn().mockResolvedValue({ id: 'key-id', keyHash: 'hash', prefix: 'mks_1234' }),
      },
      ...prismaOverrides,
    };
    return {
      service: new IntegrationsService(
        prisma as never,
        audit as never,
        new ConnectorRegistryService(),
      ),
      prisma,
      audit,
    };
  }

  it('installs marketplace connectors and records events', async () => {
    const { service: integrations, prisma } = service();

    const installed = await integrations.install('org-id', 'user-id', 'slack');

    expect(installed).toMatchObject({ id: 'integration-id' });
    expect(prisma.connector.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organisationId_key: { organisationId: 'org-id', key: 'slack' } },
      }),
    );
    const integrationEventCreate = prisma.integrationEvent.create as jest.MockedFunction<
      (input: { data: { type: IntegrationEventType } }) => Promise<unknown>
    >;
    const eventCreateCall = integrationEventCreate.mock.calls[0]?.[0];
    expect(eventCreateCall?.data.type).toBe(IntegrationEventType.INSTALLED);
  });

  it('redacts credential secret material', async () => {
    const { service: integrations } = service();

    const credential = await integrations.createCredential('org-id', 'user-id', {
      integrationId: 'integration-id',
      authType: IntegrationAuthType.API_KEY,
      label: 'Stripe key',
      secret: { apiKey: 'sk_test_secret' },
    });

    expect(credential.encryptedData).toEqual({ redacted: true });
  });

  it('starts syncs and writes sync logs', async () => {
    const { service: integrations, prisma } = service();

    const sync = await integrations.startSync('org-id', 'user-id', {
      integrationId: 'integration-id',
      mode: SyncMode.MANUAL,
      entity: 'contacts',
    });

    expect(sync.status).toBe(SyncStatus.RUNNING);
    const syncLogCreate = prisma.syncLog.create as jest.MockedFunction<
      (input: { data: { severity: IntegrationLogSeverity; message: string } }) => Promise<unknown>
    >;
    const syncLogCreateCall = syncLogCreate.mock.calls[0]?.[0];
    expect(syncLogCreateCall?.data.severity).toBe(IntegrationLogSeverity.INFO);
    expect(syncLogCreateCall?.data.message).toBe('Sync started for contacts.');
  });

  it('creates webhook deliveries for incoming webhooks', async () => {
    const { service: integrations, prisma } = service();

    const delivery = await integrations.receiveWebhook('org-id', 'endpoint-id', {
      event: 'invoice.paid',
      payload: { id: 'evt-id' },
    });

    expect(delivery).toMatchObject({ id: 'delivery-id' });
    const webhookDeliveryCreate = prisma.webhookDelivery.create as jest.MockedFunction<
      (input: { data: { status: WebhookDeliveryStatus; event: string } }) => Promise<unknown>
    >;
    const webhookCreateCall = webhookDeliveryCreate.mock.calls[0]?.[0];
    expect(webhookCreateCall?.data.status).toBe(WebhookDeliveryStatus.DELIVERED);
    expect(webhookCreateCall?.data.event).toBe('invoice.paid');
  });

  it('creates custom integration and webhook endpoint architecture records', async () => {
    const { service: integrations, prisma } = service();

    await integrations.createIntegration('org-id', 'user-id', {
      key: 'custom-rest',
      name: 'Custom REST',
      category: IntegrationCategory.CUSTOM,
      provider: 'custom',
      config: { baseUrl: 'https://example.com' },
    });
    await integrations.createWebhookEndpoint('org-id', {
      integrationId: 'integration-id',
      name: 'Inbound events',
      direction: WebhookDirection.INCOMING,
      url: 'https://example.com/webhook',
      events: ['customer.created'],
    });

    const integrationCreate = prisma.integration.create as jest.MockedFunction<
      (input: { data: { key: string; provider: string } }) => Promise<unknown>
    >;
    const integrationCreateCall = integrationCreate.mock.calls[0]?.[0];
    expect(integrationCreateCall?.data.key).toBe('custom-rest');
    expect(integrationCreateCall?.data.provider).toBe('custom');
    expect(prisma.webhookEndpoint.create).toHaveBeenCalled();
  });

  it('creates api keys without returning only hashed storage fields', async () => {
    const { service: integrations } = service();

    const key = await integrations.createApiKey('org-id', 'user-id', {
      name: 'Automation key',
      scopes: ['sync:read'],
    });

    expect(key.token).toMatch(/^mks_/);
    expect(key.keyHash).toBe('hash');
  });
});
