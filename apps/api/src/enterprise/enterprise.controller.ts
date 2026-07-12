import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import {
  AuditSummaryService,
  ComplianceRecommendationService,
  GovernanceService,
  RiskAssessmentService,
  SecurityInsightService,
} from './enterprise-ai.service';
import { EnterpriseService } from './enterprise.service';
import {
  CreateAuditEventDto,
  CreateBusinessUnitDto,
  CreateComplianceRecordDto,
  CreateCustomRoleDto,
  CreateDirectoryConnectionDto,
  CreateEnterprisePolicyDto,
  CreateHierarchyDto,
  CreateLicenseDto,
  CreatePermissionGroupDto,
  CreateSsoProviderDto,
  ListEnterpriseDto,
} from './dto/enterprise.dto';

@Controller({ path: 'enterprise', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class EnterpriseController {
  constructor(
    private readonly enterprise: EnterpriseService,
    private readonly security: SecurityInsightService,
    private readonly compliance: ComplianceRecommendationService,
    private readonly risk: RiskAssessmentService,
    private readonly governance: GovernanceService,
    private readonly auditSummary: AuditSummaryService,
  ) {}

  @Get('capabilities')
  @RequirePermissions('Enterprise.Read')
  capabilities() {
    return {
      ...this.enterprise.capabilities(),
      aiPreparation: {
        security: this.security.getArchitecture(),
        compliance: this.compliance.getArchitecture(),
        risk: this.risk.getArchitecture(),
        governance: this.governance.getArchitecture(),
        auditSummary: this.auditSummary.getArchitecture(),
      },
    };
  }

  @Get('dashboard')
  @RequirePermissions('Enterprise.Read')
  dashboard(@CurrentOrganisation() organisationId: string) {
    return this.enterprise.dashboard(organisationId);
  }

  @Get('business-units')
  @RequirePermissions('Enterprise.Read')
  businessUnits(@CurrentOrganisation() organisationId: string, @Query() query: ListEnterpriseDto) {
    return this.enterprise.list('businessUnit', organisationId, query);
  }

  @Post('business-units')
  @RequirePermissions('Enterprise.Manage')
  createBusinessUnit(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBusinessUnitDto,
  ) {
    return this.enterprise.createBusinessUnit(organisationId, user.id, dto);
  }

  @Get('hierarchy')
  @RequirePermissions('Enterprise.Read')
  hierarchy(@CurrentOrganisation() organisationId: string, @Query() query: ListEnterpriseDto) {
    return this.enterprise.list('organisationHierarchy', organisationId, query);
  }

  @Post('hierarchy')
  @RequirePermissions('Enterprise.Manage')
  createHierarchy(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateHierarchyDto,
  ) {
    return this.enterprise.createHierarchy(organisationId, user.id, dto);
  }

  @Get('roles')
  @RequirePermissions('Enterprise.Read')
  roles(@CurrentOrganisation() organisationId: string, @Query() query: ListEnterpriseDto) {
    return this.enterprise.list('customRole', organisationId, query);
  }

  @Post('roles')
  @RequirePermissions('Enterprise.Manage')
  createRole(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCustomRoleDto,
  ) {
    return this.enterprise.createCustomRole(organisationId, user.id, dto);
  }

  @Post('permission-groups')
  @RequirePermissions('Enterprise.Manage')
  createPermissionGroup(
    @CurrentOrganisation() organisationId: string,
    @Body() dto: CreatePermissionGroupDto,
  ) {
    return this.enterprise.createPermissionGroup(organisationId, dto);
  }

  @Get('policies')
  @RequirePermissions('Enterprise.Read')
  policies(@CurrentOrganisation() organisationId: string, @Query() query: ListEnterpriseDto) {
    return this.enterprise.list('enterprisePolicy', organisationId, query);
  }

  @Post('policies')
  @RequirePermissions('Enterprise.Manage')
  createPolicy(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateEnterprisePolicyDto,
  ) {
    return this.enterprise.createPolicy(organisationId, user.id, dto);
  }

  @Get('audit')
  @RequirePermissions('Enterprise.Audit')
  audit(@CurrentOrganisation() organisationId: string, @Query() query: ListEnterpriseDto) {
    return this.enterprise.list('auditEvent', organisationId, query);
  }

  @Post('audit')
  @RequirePermissions('Enterprise.Audit')
  createAudit(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAuditEventDto,
  ) {
    return this.enterprise.createAuditEvent(organisationId, user.id, dto);
  }

  @Post('sso')
  @RequirePermissions('Enterprise.Security')
  createSso(@CurrentOrganisation() organisationId: string, @Body() dto: CreateSsoProviderDto) {
    return this.enterprise.createSsoProvider(organisationId, dto);
  }

  @Post('directory-sync')
  @RequirePermissions('Enterprise.Security')
  createDirectory(
    @CurrentOrganisation() organisationId: string,
    @Body() dto: CreateDirectoryConnectionDto,
  ) {
    return this.enterprise.createDirectoryConnection(organisationId, dto);
  }

  @Get('compliance')
  @RequirePermissions('Enterprise.Read')
  complianceRecords(
    @CurrentOrganisation() organisationId: string,
    @Query() query: ListEnterpriseDto,
  ) {
    return this.enterprise.list('complianceRecord', organisationId, query);
  }

  @Post('compliance')
  @RequirePermissions('Enterprise.Manage')
  createCompliance(
    @CurrentOrganisation() organisationId: string,
    @Body() dto: CreateComplianceRecordDto,
  ) {
    return this.enterprise.createComplianceRecord(organisationId, dto);
  }

  @Post('licensing')
  @RequirePermissions('Enterprise.Manage')
  createLicense(@CurrentOrganisation() organisationId: string, @Body() dto: CreateLicenseDto) {
    return this.enterprise.createLicense(organisationId, dto);
  }
}
