import { PromptManagerService } from './prompt-manager.service';

describe('PromptManagerService', () => {
  it('returns reusable prompt templates without enabling execution', () => {
    const service = new PromptManagerService();

    const result = service.listTemplates();

    expect(result.promptExecutionEnabled).toBe(false);
    expect(result.directPromptHardcoding).toBe(false);
    expect(result.templates.map((template) => template.key)).toEqual(
      expect.arrayContaining(['executive-briefing', 'customer-summary', 'project-summary']),
    );
  });

  it('can resolve a template by key', () => {
    const service = new PromptManagerService();

    expect(service.getTemplate('document-summary')?.title).toBe('Document summary');
    expect(service.getTemplate('missing')).toBeNull();
  });
});
