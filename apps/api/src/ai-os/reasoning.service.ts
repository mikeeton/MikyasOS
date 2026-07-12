import { Injectable } from '@nestjs/common';

@Injectable()
export class ReasoningService {
  evaluate(message: string, retrieval: { sources: Record<string, unknown[]> }) {
    const sourceCount = Object.values(retrieval.sources).reduce(
      (sum, items) => sum + items.length,
      0,
    );

    return {
      intent: this.detectIntent(message),
      sourceCount,
      confidence: sourceCount > 2 ? 'high' : sourceCount > 0 ? 'medium' : 'low',
      requiresClarification: sourceCount === 0,
      destructiveActionRequested: /\b(delete|remove|archive|wipe|purge)\b/i.test(message),
    };
  }

  private detectIntent(message: string) {
    if (/project|task|sprint|blocked/i.test(message)) return 'operations';
    if (/customer|lead|deal|sales|company/i.test(message)) return 'sales';
    if (/document|policy|file|knowledge/i.test(message)) return 'knowledge';
    return 'general-briefing';
  }
}
