import { Module } from '@nestjs/common';

import { DatabaseModule } from '../infra/database/database.module';
import { RedisModule } from '../infra/redis/redis.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
