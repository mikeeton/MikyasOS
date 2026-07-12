import { Injectable } from '@nestjs/common';

@Injectable()
export class AiActionService {
  listActions() {
    return [
      'create-task',
      'create-project',
      'create-company',
      'create-contact',
      'generate-report',
      'draft-email',
      'summarise-document',
      'plan-sprint',
      'schedule-meeting',
    ].map((key) => ({
      key,
      requiresConfirmation: true,
      executionEnabled: false,
      status: 'prepared',
    }));
  }

  suggestActions(intent: string) {
    const actions = this.listActions();
    if (intent === 'operations')
      return actions.filter((action) =>
        ['create-task', 'plan-sprint', 'create-project'].includes(action.key),
      );
    if (intent === 'sales')
      return actions.filter((action) =>
        ['create-company', 'create-contact', 'draft-email'].includes(action.key),
      );
    if (intent === 'knowledge')
      return actions.filter((action) =>
        ['summarise-document', 'generate-report'].includes(action.key),
      );
    return actions.slice(0, 3);
  }
}
