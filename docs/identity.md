# Identity Platform

## Scope

Milestone 2 adds account identity, organisation membership, invitations, roles,
permissions, sessions, refresh-token rotation, and audit logging. It does not add CRM,
projects, documents, finance, dashboard, or AI chat features.

## Auth Flow

- `POST /api/v1/auth/register` creates a user and returns an access token plus refresh token.
- `POST /api/v1/auth/login` validates credentials with bcrypt and creates a session.
- `POST /api/v1/auth/refresh` rotates the refresh token and returns a new access token.
- `POST /api/v1/auth/logout` revokes the active session and refresh tokens.
- `GET /api/v1/auth/me` returns the current user without password or token fields.
- `POST /api/v1/auth/switch-organisation` changes the user's active organisation.

Access tokens are JWTs signed with `JWT_SECRET`. Refresh tokens are opaque random tokens;
only SHA-256 hashes are stored in the database.

## Multi-Tenancy Model

Users can belong to multiple organisations through `OrganisationMember`. Organisation-owned
identity records carry `organisationId` and are always queried through the active organisation
context when used behind protected guards.

`OrganisationGuard` validates that the authenticated user belongs to the organisation from
`x-organisation-id` or the user's active organisation.

## Roles And Permissions

Every organisation receives system roles when it is created:

- Owner
- Admin
- Member

Permissions are global keys such as `members:invite` and `roles:assign`. Roles are scoped to
organisations, and `RolePermission` links roles to global permissions. Guards enforce:

- `RequireRoles(...)` through `RolesGuard`
- `RequirePermissions(...)` through `PermissionsGuard`

## Invitations

`POST /api/v1/invitations` creates a hashed-token invitation for an organisation role.
`POST /api/v1/invitations/accept` accepts the invitation, creates the user when needed, adds
the membership, marks the invitation accepted, and returns auth tokens.

## Audit Logs

Audit records are written for registration, login, logout, organisation creation,
organisation switching, invitation creation, invitation acceptance, and role assignment.

## API Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/switch-organisation`
- `GET /api/v1/users/me`
- `GET /api/v1/organisations`
- `POST /api/v1/organisations`
- `GET /api/v1/roles`
- `POST /api/v1/roles/assign`
- `GET /api/v1/permissions/check?permission=permission:key`
- `POST /api/v1/invitations`
- `POST /api/v1/invitations/accept`

## Local Development

Docker Compose runs `prisma db push` for local development before starting the API, so the
identity schema is available in a fresh local database:

```bash
docker compose up --build
```

The web app uses `VITE_API_BASE_URL` and defaults to `http://localhost:3000/api/v1`.
