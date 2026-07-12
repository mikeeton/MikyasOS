import { Injectable } from '@nestjs/common';
import { AuditSeverity, Prisma } from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type {
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

type EnterpriseDelegate =
  | 'businessUnit'
  | 'organisationHierarchy'
  | 'customRole'
  | 'permissionGroup'
  | 'enterprisePolicy'
  | 'auditEvent'
  | 'securityPolicy'
  | 'sSOProvider'
  | 'directoryConnection'
  | 'complianceRecord'
  | 'retentionPolicy'
  | 'legalHold'
  | 'license';

type EnterpriseModelDelegate = {
  findMany(args: unknown): Promise<unknown[]>;
  count(args: unknown): Promise<number>;
};

@Injectable()
export class EnterpriseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogsService,
  ) {}

  capabilities() {
    return {
      modules: [
        'EnterpriseModule',
        'OrganisationHierarchyModule',
        'BusinessUnitsModule',
        'DepartmentModule',
        'AdvancedPermissionsModule',
        'SSOModule',
        'DirectorySyncModule',
        'ComplianceModule',
        'AuditModule',
        'PolicyModule',
        'AdministrationModule',
        'LicenseModule',
      ],
      ssoProviders: [
        'SAML 2.0',
        'OpenID Connect',
        'OAuth Enterprise',
        'Microsoft Entra ID',
        'Okta',
        'Google Workspace',
        'Ping Identity',
        'OneLogin',
      ],
      directorySync: ['SCIM', 'Active Directory', 'LDAP', 'Google Directory', 'Microsoft Graph'],
      compliance: ['GDPR', 'SOC 2', 'ISO 27001', 'HIPAA future', 'PCI DSS future'],
      providerSpecificLogicEnabled: false,
    };
  }

  async dashboard(organisationId: string) {
    const [
      businessUnits,
      customRoles,
      auditEvents,
      complianceGaps,
      policies,
      ssoProviders,
      directoryConnections,
      licenses,
      activeSessions,
    ] = await this.prisma.$transaction([
      this.prisma.businessUnit.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.customRole.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.auditEvent.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.complianceRecord.count({
        where: { organisationId, deletedAt: null, status: 'GAP' },
      }),
      this.prisma.enterprisePolicy.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.sSOProvider.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.directoryConnection.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.license.findFirst({ where: { organisationId, deletedAt: null } }),
      this.prisma.session.count({
        where: { organisationId, revokedAt: null, expiresAt: { gt: new Date() } },
      }),
    ]);

    return {
      organisationHealth: complianceGaps === 0 ? 'ready' : 'attention_required',
      businessUnits,
      customRoles,
      auditEvents,
      complianceGaps,
      policies,
      ssoProviders,
      directoryConnections,
      activeSessions,
      licenseUsage: {
        plan: licenses?.plan ?? 'unlicensed',
        seats: licenses?.seats ?? 0,
        usedSeats: licenses?.usedSeats ?? 0,
      },
      aiSystemStatus: 'architecture_ready',
    };
  }

  async list(delegate: EnterpriseDelegate, organisationId: string, query: ListEnterpriseDto) {
    const model = this.delegate(delegate);
    const where = this.where(organisationId, query);
    const [items, total] = await Promise.all([
      model.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      model.count({ where }),
    ]);
    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        pageCount: Math.ceil(total / query.pageSize),
        hasNextPage: query.page * query.pageSize < total,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  async createBusinessUnit(
    organisationId: string,
    actorUserId: string,
    dto: CreateBusinessUnitDto,
  ) {
    const unit = await this.prisma.businessUnit.create({
      data: {
        organisationId,
        parentId: dto.parentId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
      },
    });
    await this.record(
      organisationId,
      actorUserId,
      'enterprise.business_unit.created',
      'businessUnit',
      unit.id,
    );
    return unit;
  }

  async createHierarchy(organisationId: string, actorUserId: string, dto: CreateHierarchyDto) {
    const hierarchy = await this.prisma.organisationHierarchy.create({
      data: {
        organisationId,
        parentOrganisationId: dto.parentOrganisationId,
        childOrganisationId: dto.childOrganisationId,
        inheritedPermissions: dto.inheritedPermissions ?? true,
        delegatedAdmin: dto.delegatedAdmin ?? false,
      },
    });
    await this.record(
      organisationId,
      actorUserId,
      'enterprise.hierarchy.created',
      'organisationHierarchy',
      hierarchy.id,
    );
    return hierarchy;
  }

  async createCustomRole(organisationId: string, actorUserId: string, dto: CreateCustomRoleDto) {
    const role = await this.prisma.customRole.create({
      data: {
        organisationId,
        parentRoleId: dto.parentRoleId,
        name: dto.name,
        description: dto.description,
        permissions: dto.permissions,
        delegatedAdmin: dto.delegatedAdmin ?? false,
      },
    });
    await this.record(
      organisationId,
      actorUserId,
      'enterprise.custom_role.created',
      'customRole',
      role.id,
    );
    return role;
  }

  createPermissionGroup(organisationId: string, dto: CreatePermissionGroupDto) {
    return this.prisma.permissionGroup.create({
      data: { organisationId, name: dto.name, permissions: dto.permissions },
    });
  }

  async createPolicy(organisationId: string, actorUserId: string, dto: CreateEnterprisePolicyDto) {
    const policy = await this.prisma.enterprisePolicy.create({
      data: {
        organisationId,
        createdById: actorUserId,
        type: dto.type,
        name: dto.name,
        status: dto.status,
        rules: dto.rules as Prisma.InputJsonValue,
      },
    });
    await this.record(
      organisationId,
      actorUserId,
      'enterprise.policy.created',
      'enterprisePolicy',
      policy.id,
    );
    return policy;
  }

  createAuditEvent(organisationId: string, actorUserId: string, dto: CreateAuditEventDto) {
    return this.prisma.auditEvent.create({
      data: {
        organisationId,
        actorUserId,
        severity: dto.severity ?? AuditSeverity.INFO,
        action: dto.action,
        module: dto.module,
        metadata: (dto.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }

  createSsoProvider(organisationId: string, dto: CreateSsoProviderDto) {
    return this.prisma.sSOProvider.create({
      data: { organisationId, type: dto.type, name: dto.name, domains: dto.domains ?? [] },
    });
  }

  createDirectoryConnection(organisationId: string, dto: CreateDirectoryConnectionDto) {
    return this.prisma.directoryConnection.create({
      data: {
        organisationId,
        type: dto.type,
        name: dto.name,
        provisioning: dto.provisioning ?? true,
        deprovisioning: dto.deprovisioning ?? true,
      },
    });
  }

  createComplianceRecord(organisationId: string, dto: CreateComplianceRecordDto) {
    return this.prisma.complianceRecord.create({
      data: {
        organisationId,
        framework: dto.framework,
        status: dto.status,
        control: dto.control,
      },
    });
  }

  createLicense(organisationId: string, dto: CreateLicenseDto) {
    return this.prisma.license.create({
      data: {
        organisationId,
        plan: dto.plan,
        status: dto.status,
        seats: dto.seats ?? 1,
        features: ['enterprise_admin', 'advanced_security', 'compliance_architecture'],
      },
    });
  }

  private delegate(delegate: EnterpriseDelegate) {
    return (this.prisma as unknown as Record<EnterpriseDelegate, EnterpriseModelDelegate>)[
      delegate
    ];
  }

  private where(organisationId: string, query: ListEnterpriseDto) {
    return {
      organisationId,
      deletedAt: null,
      ...(query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {}),
    };
  }

  private async record(
    organisationId: string,
    actorUserId: string,
    action: string,
    entityType: string,
    entityId: string,
  ) {
    await this.audit.record({ organisationId, actorUserId, action, entityType, entityId });
    await this.prisma.auditEvent.create({
      data: {
        organisationId,
        actorUserId,
        severity: AuditSeverity.INFO,
        action,
        module: 'enterprise',
        entityType,
        entityId,
      },
    });
  }
}
