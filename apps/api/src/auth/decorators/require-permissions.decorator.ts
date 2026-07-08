import { SetMetadata } from '@nestjs/common';

import { PERMISSION_METADATA_KEY } from '../auth.constants';

export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSION_METADATA_KEY, permissions);
