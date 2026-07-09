import { DocumentLinkEntityType } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class CreateDocumentLinkDto {
  @IsEnum(DocumentLinkEntityType)
  entityType!: DocumentLinkEntityType;

  @IsUUID()
  entityId!: string;
}
