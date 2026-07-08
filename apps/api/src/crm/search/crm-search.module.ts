import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { DatabaseModule } from '../../infra/database/database.module';
import { PermissionsModule } from '../../permissions/permissions.module';
import { CrmSearchController } from './crm-search.controller';
import { CrmSearchService } from './crm-search.service';

@Module({
  imports: [JwtModule.register({}), DatabaseModule, PermissionsModule],
  controllers: [CrmSearchController],
  providers: [CrmSearchService, JwtAuthGuard, OrganisationGuard, PermissionsGuard],
})
export class CrmSearchModule {}
