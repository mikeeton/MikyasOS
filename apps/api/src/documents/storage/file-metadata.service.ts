import { Injectable } from '@nestjs/common';
import { DocumentType } from '@prisma/client';
import { randomUUID } from 'node:crypto';

@Injectable()
export class FileMetadataService {
  toSafeFileName(originalFileName: string) {
    return originalFileName
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  }

  createStorageKey(organisationId: string, originalFileName: string) {
    const safeName = this.toSafeFileName(originalFileName);
    return `organisations/${organisationId}/documents/${randomUUID()}-${safeName}`;
  }

  inferDocumentType(mimeType: string, extension: string) {
    if (mimeType === 'application/pdf') return DocumentType.PDF;
    if (extension === 'docx') return DocumentType.DOCX;
    if (extension === 'xlsx') return DocumentType.XLSX;
    if (extension === 'csv') return DocumentType.CSV;
    if (mimeType.startsWith('image/')) return DocumentType.IMAGE;
    if (extension === 'md' || extension === 'markdown') return DocumentType.MARKDOWN;
    if (mimeType === 'text/plain') return DocumentType.TEXT;
    return DocumentType.OTHER;
  }
}
