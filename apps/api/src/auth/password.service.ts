import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class PasswordService {
  hashPassword(password: string) {
    return hash(password, 12);
  }

  verifyPassword(password: string, passwordHash: string) {
    return compare(password, passwordHash);
  }
}
