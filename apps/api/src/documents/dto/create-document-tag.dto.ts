import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDocumentTagDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  colour?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;
}

export class AssignDocumentTagDto {
  @IsString()
  @MinLength(1)
  tagId!: string;
}
