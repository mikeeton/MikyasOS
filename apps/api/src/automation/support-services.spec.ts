import { TemplateService } from './support-services';

describe('TemplateService', () => {
  it('returns built-in templates when no persisted templates exist', async () => {
    const prisma = {
      workflowTemplate: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    const service = new TemplateService(prisma as never);

    const templates = await service.list('org-id');

    expect(templates.length).toBeGreaterThan(0);
    expect(templates.map((template) => template.name)).toEqual(
      expect.arrayContaining(['Customer onboarding', 'Lead follow-up']),
    );
  });
});
