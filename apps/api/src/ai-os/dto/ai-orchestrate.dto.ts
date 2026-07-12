import { IsIn, IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AiSelectedEntityDto {
  @IsIn(['crm.company', 'crm.contact', 'project', 'task', 'document'])
  type!: 'crm.company' | 'crm.contact' | 'project' | 'task' | 'document';

  @IsString()
  id!: string;
}

export class AiOrchestrateDto {
  @IsString()
  @MaxLength(4000)
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  conversationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  currentPage?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AiSelectedEntityDto)
  selectedEntity?: AiSelectedEntityDto;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
