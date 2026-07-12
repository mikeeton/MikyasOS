# Enterprise Platform

Milestone 13 adds enterprise governance architecture for large organisations that need hierarchy, delegated administration, advanced permissions, SSO preparation, directory sync preparation, audit trails, compliance records, retention policies, legal holds, and licensing.

## Architecture

Backend module:

- `EnterpriseModule`
- `OrganisationHierarchyModule`
- `BusinessUnitsModule`
- `DepartmentModule`
- `AdvancedPermissionsModule`
- `SSOModule`
- `DirectorySyncModule`
- `ComplianceModule`
- `AuditModule`
- `PolicyModule`
- `AdministrationModule`
- `LicenseModule`

AI preparation services:

- `SecurityInsightService`
- `ComplianceRecommendationService`
- `RiskAssessmentService`
- `GovernanceService`
- `AuditSummaryService`

These services expose architecture only. LLM generation and automatic enforcement are disabled.

## Database Models

Enterprise adds:

- `BusinessUnit`
- `OrganisationHierarchy`
- `EnterprisePolicy`
- `AuditEvent`
- `SecurityPolicy`
- `CustomRole`
- `PermissionGroup`
- `SSOProvider`
- `DirectoryConnection`
- `ComplianceRecord`
- `RetentionPolicy`
- `LegalHold`
- `License`

All records are organisation-scoped, UUID-based, timestamped, indexed, and soft-deletable where useful.

## Security Architecture

Prepared capabilities:

- custom roles
- role inheritance
- permission groups
- temporary permissions
- approval-based permissions
- delegated administration
- MFA architecture
- IP allow lists
- trusted devices
- session policy architecture

## SSO And Directory Sync

Prepared SSO providers:

- SAML 2.0
- OpenID Connect
- OAuth Enterprise
- Microsoft Entra ID
- Okta
- Google Workspace
- Ping Identity
- OneLogin

Prepared directory sync providers:

- SCIM
- Active Directory
- LDAP
- Google Directory
- Microsoft Graph

Provider-specific logic is intentionally not implemented yet.

## Compliance

Prepared frameworks:

- GDPR
- SOC 2
- ISO 27001
- HIPAA future
- PCI DSS future

Retention and legal hold architecture is in place, but destructive retention execution requires future explicit administrator approval flows.

## API

All endpoints are under `/api/v1/enterprise` and require JWT auth plus organisation isolation.

- `GET /capabilities`
- `GET /dashboard`
- `GET /business-units`
- `POST /business-units`
- `GET /hierarchy`
- `POST /hierarchy`
- `GET /roles`
- `POST /roles`
- `POST /permission-groups`
- `GET /policies`
- `POST /policies`
- `GET /audit`
- `POST /audit`
- `POST /sso`
- `POST /directory-sync`
- `GET /compliance`
- `POST /compliance`
- `POST /licensing`

## Frontend Routes

- `/app/admin`
- `/app/admin/organisations`
- `/app/admin/business-units`
- `/app/admin/users`
- `/app/admin/roles`
- `/app/admin/policies`
- `/app/admin/audit`
- `/app/admin/security`
- `/app/admin/compliance`
- `/app/admin/licensing`

## Developer Guide

Useful commands:

```bash
npm run prisma:generate -w @mikyasos/api
npm run typecheck
npm run lint
npm test
npm run build
docker compose up -d
```

Manual smoke flow:

1. Register or log in.
2. Create or switch to an organisation.
3. Open `/app/admin`.
4. Create or list business units.
5. Create a custom role.
6. Verify `/api/v1/enterprise/dashboard`.
7. Verify `/api/v1/enterprise/capabilities`.

## Known Limitations

- SSO providers are architecture-only.
- Directory sync providers are architecture-only.
- No production SCIM server yet.
- No destructive retention execution.
- No provider-specific MFA enforcement yet.
