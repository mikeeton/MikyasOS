import { DocumentVisibility } from '@prisma/client';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDocumentDto {
  @IsOptional()
  @IsUUID()
  folderId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(180)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(240)
  originalFileName!: string;

  @IsString()
  @MinLength(1)
  mimeType!: string;

  @Min(1)
  fileSize!: number;

  @IsString()
  @MinLength(16)
  checksum!: string;

  @IsOptional()
  @IsString()
  storageBucket?: string;

  @IsOptional()
  visibility?: DocumentVisibility;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
