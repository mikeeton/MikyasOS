import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentOcrService {
  getOcrArchitecture() {
    return {
      ocrEnabled: false,
      preparedInputs: ['image', 'pdf', 'scanned-document', 'future-handwriting'],
      asyncOnly: true,
    };
  }
}
