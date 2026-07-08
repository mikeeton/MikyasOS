import { Matches, IsString, MinLength } from 'class-validator';

export class CreateCustomerTagDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  color!: string;
}
