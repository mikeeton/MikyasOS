import { randomBytes, createHash } from 'node:crypto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  createOpaqueToken() {
    return randomBytes(48).toString('base64url');
  }

  hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
