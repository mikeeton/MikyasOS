import { IsArray, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateProjectCommentDto {
  @IsUUID()
  projectId!: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;

  @IsOptional()
  @IsUUID()
  parentCommentId?: string;

  @IsString()
  @MinLength(1)
  content!: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  mentions?: string[];
}
