import { ReasoningService } from './reasoning.service';

describe('ReasoningService', () => {
  it('detects intent, confidence, and destructive requests', () => {
    const service = new ReasoningService();

    const result = service.evaluate('delete blocked project tasks', {
      sources: { companies: [], projects: [{ id: 'project-id' }], tasks: [], documents: [] },
    });

    expect(result.intent).toBe('operations');
    expect(result.confidence).toBe('medium');
    expect(result.destructiveActionRequested).toBe(true);
  });

  it('asks for clarification when no grounded sources exist', () => {
    const service = new ReasoningService();

    const result = service.evaluate('summarise the business', {
      sources: { companies: [], projects: [], tasks: [], documents: [] },
    });

    expect(result.confidence).toBe('low');
    expect(result.requiresClarification).toBe(true);
  });
});
