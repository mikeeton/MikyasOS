import type { IntegrationAuthType } from '@prisma/client';

export type ConnectorContext = {
  organisationId: string;
  integrationId?: string;
};

export type ConnectorResult = {
  ok: boolean;
  status: 'architecture_ready' | 'completed' | 'failed';
  message: string;
  metadata?: Record<string, unknown>;
};

export interface Connector {
  key: string;
  name: string;
  authTypes: IntegrationAuthType[];
  authenticate(context: ConnectorContext): Promise<ConnectorResult>;
  healthCheck(context: ConnectorContext): Promise<ConnectorResult>;
  connect(context: ConnectorContext): Promise<ConnectorResult>;
  disconnect(context: ConnectorContext): Promise<ConnectorResult>;
  synchronise(context: ConnectorContext): Promise<ConnectorResult>;
  send(context: ConnectorContext, payload: Record<string, unknown>): Promise<ConnectorResult>;
  receive(context: ConnectorContext, payload: Record<string, unknown>): Promise<ConnectorResult>;
  validate(context: ConnectorContext): Promise<ConnectorResult>;
  handleError(context: ConnectorContext, error: Error): Promise<ConnectorResult>;
}

export abstract class BaseConnector implements Connector {
  abstract key: string;
  abstract name: string;
  abstract authTypes: IntegrationAuthType[];

  protected ready(action: string): ConnectorResult {
    return {
      ok: true,
      status: 'architecture_ready',
      message: `${this.name} ${action} architecture is ready. Production connector execution is disabled.`,
    };
  }

  authenticate() {
    return Promise.resolve(this.ready('authentication'));
  }

  healthCheck() {
    return Promise.resolve(this.ready('health check'));
  }

  connect() {
    return Promise.resolve(this.ready('connect'));
  }

  disconnect() {
    return Promise.resolve(this.ready('disconnect'));
  }

  synchronise() {
    return Promise.resolve(this.ready('sync'));
  }

  send() {
    return Promise.resolve(this.ready('send'));
  }

  receive() {
    return Promise.resolve(this.ready('receive'));
  }

  validate() {
    return Promise.resolve(this.ready('validation'));
  }

  handleError(_context: ConnectorContext, error: Error) {
    return Promise.resolve({
      ok: false,
      status: 'failed' as const,
      message: error.message,
    });
  }
}
