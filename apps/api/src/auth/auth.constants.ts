export const ROLE_METADATA_KEY = 'mikyasos:roles';
export const PERMISSION_METADATA_KEY = 'mikyasos:permissions';

export const DEFAULT_PERMISSIONS = [
  'organisation:read',
  'organisation:update',
  'members:invite',
  'members:manage',
  'roles:assign',
  'permissions:read',
  'crm:read',
  'crm:write',
  'crm:delete',
  'Project.Create',
  'Project.Read',
  'Project.Update',
  'Project.Delete',
  'Task.Create',
  'Task.Update',
  'Task.Assign',
  'Task.Delete',
  'Comments.Create',
  'Comments.Delete',
  'Files.Upload',
  'Files.Delete',
  'Milestones.Manage',
  'TimeTracking.Manage',
] as const;

export type DefaultPermission = (typeof DEFAULT_PERMISSIONS)[number];
