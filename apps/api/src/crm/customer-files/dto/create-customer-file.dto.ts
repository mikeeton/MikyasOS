import { Type } from 'class-transformer';
import { IsInt, IsMimeType, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateCustomerFileDto {
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  contactId?: string;

  @IsString()
  @MinLength(1)
  originalFilename!: string;

  @IsString()
  @MinLength(1)
  storageKey!: string;

  @IsMimeType()
  mimeType!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  fileSize!: number;
}
