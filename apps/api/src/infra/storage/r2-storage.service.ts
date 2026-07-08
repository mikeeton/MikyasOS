import { Injectable, NotImplementedException } from '@nestjs/common';

import { StorageService } from './storage.service';

@Injectable()
export class R2StorageService implements StorageService {
  createPresignedUploadUrl(_key: string, _contentType: string): Promise<string> {
    return Promise.reject(
      new NotImplementedException('Cloudflare R2 client is configured when storage features ship.'),
    );
  }

  createPresignedDownloadUrl(_key: string): Promise<string> {
    return Promise.reject(
      new NotImplementedException('Cloudflare R2 client is configured when storage features ship.'),
    );
  }
}
