import { SetMetadata } from '@nestjs/common';
import type { OrganisationRoleType } from '@prisma/client';

import { ROLE_METADATA_KEY } from '../auth.constants';

export const RequireRoles = (...roles: OrganisationRoleType[]) =>
  SetMetadata(ROLE_METADATA_KEY, roles);
