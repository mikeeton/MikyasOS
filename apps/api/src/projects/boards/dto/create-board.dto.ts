import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateBoardDto {
  @IsUUID()
  projectId!: string;

  @IsString()
  @MinLength(2)
  name!: string;
}
