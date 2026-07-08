import { IsArray, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateProjectCommentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  mentions?: string[];
}
