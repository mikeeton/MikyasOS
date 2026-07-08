import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AppConfigModule } from './config/app-config.module';
import { AppConfigService } from './config/app-config.service';
import { HealthModule } from './health/health.module';
import { AiModule } from './infra/ai/ai.module';
import { DatabaseModule } from './infra/database/database.module';
import { RedisModule } from './infra/redis/redis.module';
import { StorageModule } from './infra/storage/storage.module';

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
    HealthModule,
  ],
})
export class AppModule {}
