import { AiActionService } from './ai-action.service';

describe('AiActionService', () => {
  it('marks every AI action as confirmation required and disabled for execution', () => {
    const service = new AiActionService();

    const actions = service.listActions();

    expect(actions.length).toBeGreaterThan(0);
    expect(actions.every((action) => action.requiresConfirmation)).toBe(true);
    expect(actions.every((action) => action.executionEnabled === false)).toBe(true);
  });

  it('suggests intent-specific actions', () => {
    const service = new AiActionService();

    expect(service.suggestActions('operations').map((action) => action.key)).toEqual(
      expect.arrayContaining(['create-task', 'plan-sprint']),
    );
    expect(service.suggestActions('sales').map((action) => action.key)).toEqual(
      expect.arrayContaining(['create-company', 'draft-email']),
    );
  });
});
