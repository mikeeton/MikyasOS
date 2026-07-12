import { IntegrationAuthType } from '@prisma/client';

import { ConnectorRegistryService } from './connector-registry.service';

describe('ConnectorRegistryService', () => {
  it('returns registered connector definitions and SDK instances', async () => {
    const registry = new ConnectorRegistryService();

    const definitions = registry.definitions();
    const slack = registry.get('slack');

    expect(definitions.length).toBeGreaterThan(0);
    expect(slack?.authTypes).toContain(IntegrationAuthType.OAUTH2);
    await expect(slack?.healthCheck({ organisationId: 'org-id' })).resolves.toMatchObject({
      ok: true,
      status: 'architecture_ready',
    });
  });
});
