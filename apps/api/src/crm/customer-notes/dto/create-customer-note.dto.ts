import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCustomerNoteDto {
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  contactId?: string;

  @IsString()
  @MinLength(1)
  content!: string;
}
