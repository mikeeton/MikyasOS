import { IsEmail, IsUUID } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email!: string;

  @IsUUID()
  roleId!: string;
}
