export const ROLE_METADATA_KEY = 'mikyasos:roles';
export const PERMISSION_METADATA_KEY = 'mikyasos:permissions';

export const DEFAULT_PERMISSIONS = [
  'organisation:read',
  'organisation:update',
  'members:invite',
  'members:manage',
  'roles:assign',
  'permissions:read',
] as const;

export type DefaultPermission = (typeof DEFAULT_PERMISSIONS)[number];
