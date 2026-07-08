export const APP_NAME = 'mikyasOS';

export type ApiEnvelope<T> = {
  data: T;
  requestId: string;
  timestamp: string;
};

export type HealthStatus = 'ok' | 'degraded' | 'down';

export type HealthResponse = {
  status: HealthStatus;
  services: Record<string, HealthStatus>;
  uptime: number;
};
