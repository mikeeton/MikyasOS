import { IsUUID } from 'class-validator';

export class AssignProjectLabelDto {
  @IsUUID()
  taskId!: string;

  @IsUUID()
  labelId!: string;
}
