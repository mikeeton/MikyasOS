import { KnowledgeRetrievalService } from './knowledge-retrieval.service';

describe('KnowledgeRetrievalService', () => {
  it('retrieves tenant-scoped sources across business modules', async () => {
    type FindManyInput = { where: { organisationId: string; deletedAt: null } };
    const companyFindMany = jest
      .fn<Promise<Array<{ id: string; name: string }>>, [FindManyInput]>()
      .mockResolvedValue([{ id: 'company-id', name: 'Acme' }]);
    const prisma = {
      company: { findMany: companyFindMany },
      project: { findMany: jest.fn().mockResolvedValue([]) },
      task: { findMany: jest.fn().mockResolvedValue([]) },
      document: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const service = new KnowledgeRetrievalService(prisma as never);

    const result = await service.retrieve('org-id', 'Acme');

    expect(result.sources.companies).toHaveLength(1);
    expect(companyFindMany.mock.calls[0]).toBeDefined();
    const companyCall = companyFindMany.mock.calls[0]![0];
    expect(companyCall.where.organisationId).toBe('org-id');
    expect(companyCall.where.deletedAt).toBeNull();
    expect(result.vectorSearchPrepared).toBe(true);
  });
});
