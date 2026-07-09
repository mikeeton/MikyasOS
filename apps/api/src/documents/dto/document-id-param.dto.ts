import { IsUUID } from 'class-validator';

export class DocumentIdParamDto {
  @IsUUID()
  id!: string;
}

export class DocumentLinkIdParamDto extends DocumentIdParamDto {
  @IsUUID()
  linkId!: string;
}
