import { IsUUID } from 'class-validator';

export class WorkIdParam {
  @IsUUID()
  id!: string;
}

export class ProjectIdParam {
  @IsUUID()
  projectId!: string;
}
