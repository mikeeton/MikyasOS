import { Injectable } from '@nestjs/common';
import { IntegrationAuthType, IntegrationCategory } from '@prisma/client';

import { BaseConnector, type Connector } from './connector-sdk';

type ConnectorDefinition = {
  key: string;
  name: string;
  category: IntegrationCategory;
  provider: string;
  description: string;
  authTypes: IntegrationAuthType[];
  verified: boolean;
  featured: boolean;
  actions: string[];
};

class RegisteredConnector extends BaseConnector {
  key: string;
  name: string;
  authTypes: IntegrationAuthType[];

  constructor(definition: ConnectorDefinition) {
    super();
    this.key = definition.key;
    this.name = definition.name;
    this.authTypes = definition.authTypes;
  }
}

const CONNECTORS: ConnectorDefinition[] = [
  {
    key: 'google-workspace',
    name: 'Google Workspace',
    category: IntegrationCategory.CLOUD_SERVICE,
    provider: 'google',
    description: 'Gmail, Calendar, Drive, Contacts, and Workspace identity architecture.',
    authTypes: [IntegrationAuthType.OAUTH2],
    verified: true,
    featured: true,
    actions: ['sync_contacts', 'sync_calendar', 'sync_files', 'send_email'],
  },
  {
    key: 'microsoft-365',
    name: 'Microsoft 365',
    category: IntegrationCategory.CLOUD_SERVICE,
    provider: 'microsoft',
    description: 'Outlook, Calendar, OneDrive, Teams, and Microsoft Graph architecture.',
    authTypes: [IntegrationAuthType.OAUTH2],
    verified: true,
    featured: true,
    actions: ['sync_email', 'sync_calendar', 'sync_files', 'send_message'],
  },
  {
    key: 'slack',
    name: 'Slack',
    category: IntegrationCategory.COMMUNICATION,
    provider: 'slack',
    description: 'Channels, notifications, slash commands, and webhook architecture.',
    authTypes: [IntegrationAuthType.OAUTH2, IntegrationAuthType.WEBHOOK_SECRET],
    verified: true,
    featured: true,
    actions: ['send_message', 'receive_events', 'sync_channels'],
  },
  {
    key: 'github',
    name: 'GitHub',
    category: IntegrationCategory.DEVELOPMENT,
    provider: 'github',
    description: 'Repositories, issues, pull requests, deployments, and webhook architecture.',
    authTypes: [IntegrationAuthType.OAUTH2, IntegrationAuthType.API_KEY],
    verified: true,
    featured: false,
    actions: ['sync_issues', 'sync_pull_requests', 'receive_webhooks'],
  },
  {
    key: 'stripe',
    name: 'Stripe',
    category: IntegrationCategory.PAYMENTS,
    provider: 'stripe',
    description: 'Customers, payments, subscriptions, invoices, and webhook architecture.',
    authTypes: [IntegrationAuthType.API_KEY, IntegrationAuthType.WEBHOOK_SECRET],
    verified: true,
    featured: true,
    actions: ['sync_customers', 'sync_invoices', 'receive_payment_events'],
  },
  {
    key: 'xero',
    name: 'Xero',
    category: IntegrationCategory.ACCOUNTING,
    provider: 'xero',
    description: 'Accounting contacts, invoices, payments, tax, and reconciliation architecture.',
    authTypes: [IntegrationAuthType.OAUTH2],
    verified: false,
    featured: false,
    actions: ['sync_invoices', 'sync_payments', 'sync_contacts'],
  },
  {
    key: 'hubspot',
    name: 'HubSpot',
    category: IntegrationCategory.CRM,
    provider: 'hubspot',
    description: 'Companies, contacts, deals, lifecycle stages, and webhook architecture.',
    authTypes: [IntegrationAuthType.OAUTH2, IntegrationAuthType.API_KEY],
    verified: false,
    featured: false,
    actions: ['sync_companies', 'sync_contacts', 'sync_deals'],
  },
  {
    key: 'rest-api',
    name: 'Custom REST API',
    category: IntegrationCategory.CUSTOM,
    provider: 'custom',
    description: 'Generic REST connector architecture for future custom integrations.',
    authTypes: [
      IntegrationAuthType.API_KEY,
      IntegrationAuthType.BEARER_TOKEN,
      IntegrationAuthType.BASIC,
    ],
    verified: false,
    featured: false,
    actions: ['send_request', 'receive_webhook', 'validate_schema'],
  },
];

@Injectable()
export class ConnectorRegistryService {
  definitions() {
    return CONNECTORS;
  }

  categories() {
    return Object.values(IntegrationCategory);
  }

  get(key: string): Connector | null {
    const definition = CONNECTORS.find((connector) => connector.key === key);
    return definition ? new RegisteredConnector(definition) : null;
  }

  requireDefinition(key: string) {
    const definition = CONNECTORS.find((connector) => connector.key === key);
    if (!definition) {
      throw new Error(`Connector ${key} is not registered.`);
    }
    return definition;
  }
}
