import { IsUUID } from 'class-validator';

export class AssignCustomerTagDto {
  @IsUUID()
  companyId!: string;

  @IsUUID()
  tagId!: string;
}
