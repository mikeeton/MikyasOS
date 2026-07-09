import { Injectable } from '@nestjs/common';

import { StorageService } from '../../infra/storage/storage.service';

@Injectable()
export class DocumentStorageService {
  constructor(private readonly storage: StorageService) {}

  createUploadTarget(key: string, contentType: string) {
    return this.storage.createPresignedUploadUrl(key, contentType);
  }

  createDownloadTarget(key: string) {
    return this.storage.createPresignedDownloadUrl(key);
  }
}
