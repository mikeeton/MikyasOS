import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { DatabaseModule } from '../infra/database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';
import {
  AuditSummaryService,
  ComplianceRecommendationService,
  GovernanceService,
  RiskAssessmentService,
  SecurityInsightService,
} from './enterprise-ai.service';
import { EnterpriseController } from './enterprise.controller';
import { EnterpriseService } from './enterprise.service';

@Module({
  imports: [DatabaseModule, JwtModule.register({}), PermissionsModule, AuditLogsModule],
  controllers: [EnterpriseController],
  providers: [
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
    EnterpriseService,
    SecurityInsightService,
    ComplianceRecommendationService,
    RiskAssessmentService,
    GovernanceService,
    AuditSummaryService,
  ],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}

export class OrganisationHierarchyModule {}
export class BusinessUnitsModule {}
export class DepartmentModule {}
export class AdvancedPermissionsModule {}
export class SSOModule {}
export class DirectorySyncModule {}
export class ComplianceModule {}
export class AuditModule {}
export class PolicyModule {}
export class AdministrationModule {}
export class LicenseModule {}
