import { BadRequestException, Injectable } from '@nestjs/common';

const maxFileSizeBytes = 25 * 1024 * 1024;

const supportedFileTypes = new Map<string, readonly string[]>([
  ['application/pdf', ['pdf']],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', ['docx']],
  ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ['xlsx']],
  ['text/csv', ['csv']],
  ['image/png', ['png']],
  ['image/jpeg', ['jpg', 'jpeg']],
  ['image/webp', ['webp']],
  ['text/plain', ['txt']],
  ['text/markdown', ['md', 'markdown']],
]);

@Injectable()
export class FileValidationService {
  validate(input: { originalFileName: string; mimeType: string; fileSize: number }) {
    if (input.fileSize > maxFileSizeBytes) {
      throw new BadRequestException('Files can be up to 25MB on the current plan.');
    }

    const extension = this.getExtension(input.originalFileName);
    const allowedExtensions = supportedFileTypes.get(input.mimeType);

    if (!allowedExtensions || !allowedExtensions.includes(extension)) {
      throw new BadRequestException('This file type is not supported yet.');
    }

    return { extension };
  }

  private getExtension(fileName: string) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension || extension === fileName.toLowerCase()) {
      throw new BadRequestException('A supported file extension is required.');
    }
    return extension;
  }
}
