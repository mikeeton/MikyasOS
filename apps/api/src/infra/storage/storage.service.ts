export abstract class StorageService {
  abstract createPresignedUploadUrl(key: string, contentType: string): Promise<string>;
  abstract createPresignedDownloadUrl(key: string): Promise<string>;
}
