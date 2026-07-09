import { IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UploadDocumentVersionDto {
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
  @MaxLength(500)
  changeNote?: string;
}
