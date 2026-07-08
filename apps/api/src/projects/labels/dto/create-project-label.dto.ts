import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateProjectLabelDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  colour?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}
