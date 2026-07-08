import { IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateProjectFileDto {
  @IsUUID()
  projectId!: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;

  @IsOptional()
  @IsUUID()
  commentId?: string;

  @IsString()
  @MinLength(2)
  storageKey!: string;

  @IsString()
  @MinLength(1)
  originalFilename!: string;

  @IsString()
  mimeType!: string;

  @IsInt()
  @Min(1)
  fileSize!: number;
}
