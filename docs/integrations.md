# Integrations Marketplace

Milestone 12 adds the mikyasOS integration gateway. It prepares one architecture for connecting external services, managing credentials, receiving and sending webhooks, running sync jobs, and feeding future AI context from connected systems.

## Architecture

Backend module:

- `IntegrationsModule`
- `ConnectorModule`
- `WebhookModule`
- `OAuthModule`
- `SyncEngineModule`
- `MarketplaceModule`
- `CredentialsModule`
- `IntegrationLogsModule`
- `IntegrationHealthModule`
- `ConnectorRegistryModule`

Core services:

- `IntegrationsService` manages installed integrations, credentials, connections, syncs, webhooks, logs, health checks, API keys, and integration events.
- `ConnectorRegistryService` exposes the connector catalogue and SDK instances.
- `BaseConnector` defines the reusable connector contract.

AI preparation services:

- `IntegrationRecommendationService`
- `SyncOptimisationService`
- `ConnectorHealthService`
- `CredentialAnalysisService`
- `AutomationSuggestionService`

These expose deterministic architecture only. LLM generation and production third-party execution are intentionally disabled.

## Database Models

Integrations adds:

- `Integration`
- `IntegrationType`
- `IntegrationCredential`
- `IntegrationConnection`
- `IntegrationSync`
- `WebhookEndpoint`
- `WebhookDelivery`
- `Connector`
- `ConnectorAction`
- `SyncLog`
- `IntegrationHealth`
- `IntegrationEvent`
- `APIKey`

Records are organisation-scoped, UUID-based, timestamped, soft-deletable where useful, indexed, and audit-friendly.

## Connector SDK

Every connector implements:

- `authenticate`
- `healthCheck`
- `connect`
- `disconnect`
- `synchronise`
- `send`
- `receive`
- `validate`
- `handleError`

The current SDK returns architecture-ready results only. Production connectors can later subclass `BaseConnector` and provide provider-specific implementations.

## Supported Connector Architecture

Prepared marketplace connectors include:

- Google Workspace
- Microsoft 365
- Slack
- GitHub
- Stripe
- Xero
- HubSpot
- Custom REST API

The registry is ready to expand to Gmail, Outlook, calendars, Drive, OneDrive, Dropbox, Teams, Discord, GitLab, QuickBooks, Zoom, Salesforce, Zapier, n8n, REST APIs, and GraphQL APIs.

## OAuth And Credentials

Supported auth architecture:

- OAuth2
- API keys
- bearer tokens
- basic auth
- webhook secrets
- future SAML

Credentials are stored through `IntegrationCredential.encryptedData`. In local development this is a clearly marked placeholder; production must use a real KMS or encryption provider.

## Sync Engine

Prepared sync modes:

- manual
- scheduled
- webhook
- incremental
- full

Sync records support status tracking, checkpoints, conflict metadata, retries, summaries, errors, logs, and future queue-backed execution.

## Webhooks

Webhook architecture supports:

- incoming endpoints
- outgoing endpoints
- signing secret hashes
- delivery records
- retries
- replay preparation
- logging
- verification preparation

## API

All endpoints are under `/api/v1/integrations` and require JWT auth plus organisation isolation.

- `GET /capabilities`
- `GET /marketplace`
- `GET /registry`
- `GET /`
- `POST /`
- `POST /marketplace/:connectorKey/install`
- `GET /connections`
- `POST /connections`
- `GET /credentials`
- `POST /credentials`
- `GET /syncs`
- `POST /syncs`
- `POST /syncs/:id/complete`
- `GET /webhooks`
- `POST /webhooks`
- `POST /webhooks/:id/receive`
- `GET /logs`
- `POST /logs`
- `GET /health`
- `POST /:id/health-check`
- `POST /api-keys`
- `GET /oauth/:provider/architecture`

## Frontend Routes

- `/app/integrations`
- `/app/integrations/marketplace`
- `/app/integrations/installed`
- `/app/integrations/:id`
- `/app/integrations/logs`
- `/app/integrations/settings`

The UI includes a marketplace, installed connector view, detail page, sync dashboard, log viewer, credential management architecture, webhook architecture, and AI readiness placeholders.

## Security

Integrations uses:

- JWT auth
- organisation isolation
- permission guards
- integration permissions
- audit logging
- hashed API keys
- credential redaction
- webhook secret hashing
- no plaintext secret exposure

## Developer Guide

Useful commands:

```bash
npm run prisma:generate -w @mikyasos/api
npm run typecheck
npm run lint
npm test
npm run build
docker compose up -d
```

Manual smoke flow:

1. Register or log in.
2. Create or switch to an organisation.
3. Open `/app/integrations`.
4. Open `/app/integrations/marketplace`.
5. Install the Slack connector.
6. Verify `/api/v1/integrations/capabilities`.
7. Verify `/api/v1/integrations/marketplace`.
8. Start a manual sync and check `/api/v1/integrations/logs`.

## Future Work

Milestone 13 can expand into:

- real OAuth provider callbacks
- production credential encryption
- BullMQ sync execution workers
- real Slack, Google, Microsoft, GitHub, Stripe, and Xero connectors
- webhook signature verification per provider
- connector developer portal
- GraphQL connector architecture
- scheduled sync runner
- AI connector recommendations with citations
