import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get nodeEnv() {
    return this.config.getOrThrow<string>('NODE_ENV');
  }

  get port() {
    return this.config.get<number>('API_PORT', 3000);
  }

  get databaseUrl() {
    return this.config.getOrThrow<string>('DATABASE_URL');
  }

  get redisUrl() {
    return this.config.getOrThrow<string>('REDIS_URL');
  }

  get jwtSecret() {
    return this.config.getOrThrow<string>('JWT_SECRET');
  }

  get jwtExpiresIn() {
    return this.config.get<string>('JWT_EXPIRES_IN', '15m');
  }

  get jwtRefreshExpiresInDays() {
    return this.config.get<number>('JWT_REFRESH_EXPIRES_IN_DAYS', 30);
  }

  get corsOrigin() {
    return this.config.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  }

  get openRouterBaseUrl() {
    return this.config.get<string>('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1');
  }

  get openRouterApiKey() {
    return this.config.get<string>('OPENROUTER_API_KEY');
  }
}
