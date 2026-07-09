import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentSummaryService {
  getSummaryArchitecture() {
    return {
      promptExecutionEnabled: false,
      summaryTypes: [
        'executive',
        'policy',
        'contract',
        'proposal',
        'meeting',
        'technical-documentation',
      ],
      providerPath: 'OpenRouter abstraction only',
      storageAccess: 'No direct AI storage access',
    };
  }
}
