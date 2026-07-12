import { Injectable } from '@nestjs/common';

import { AI_PROMPT_TEMPLATES } from './prompts/prompt-library';

@Injectable()
export class PromptManagerService {
  listTemplates() {
    return {
      templates: AI_PROMPT_TEMPLATES,
      promptExecutionEnabled: false,
      storage: 'code-template-library',
      directPromptHardcoding: false,
    };
  }

  getTemplate(key: string) {
    return AI_PROMPT_TEMPLATES.find((template) => template.key === key) ?? null;
  }
}
