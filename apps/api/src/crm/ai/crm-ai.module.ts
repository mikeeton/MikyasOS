import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { AiModule } from '../../infra/ai/ai.module';
import { DatabaseModule } from '../../infra/database/database.module';
import { PermissionsModule } from '../../permissions/permissions.module';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { CrmAiController } from './crm-ai.controller';
import { CrmEmbeddingService } from './crm-embedding.service';
import { CustomerInsightService } from './customer-insight.service';
import { CustomerSummaryService } from './customer-summary.service';

@Module({
  imports: [JwtModule.register({}), AiModule, DatabaseModule, PermissionsModule],
  controllers: [CrmAiController],
  providers: [
    CustomerInsightService,
    CustomerSummaryService,
    CrmEmbeddingService,
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
  ],
  exports: [CustomerInsightService, CustomerSummaryService, CrmEmbeddingService],
})
export class CrmAiModule {}
