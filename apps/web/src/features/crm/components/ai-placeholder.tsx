import { Bot, BrainCircuit, Lightbulb, ShieldAlert, Sparkles, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const placeholderConfig = {
  customerSummary: {
    icon: BrainCircuit,
    title: 'AI Customer Summary',
    description: 'Coming soon: executive context, important signals, and relationship history.',
  },
  leadInsights: {
    icon: Sparkles,
    title: 'AI Lead Insights',
    description: 'Coming soon: lead quality, qualification gaps, and source analysis.',
  },
  opportunitySuggestions: {
    icon: Target,
    title: 'AI Opportunity Suggestions',
    description: 'Coming soon: deal review, next steps, and close-risk signals.',
  },
  nextBestAction: {
    icon: Lightbulb,
    title: 'AI Next Best Action',
    description: 'Coming soon: timely follow-up suggestions grounded in CRM history.',
  },
  riskDetection: {
    icon: ShieldAlert,
    title: 'AI Risk Detection',
    description: 'Coming soon: relationship health and churn-risk indicators.',
  },
  salesCoach: {
    icon: Bot,
    title: 'AI Sales Coach',
    description: 'Coming soon: sales recommendations and coaching prompts.',
  },
} satisfies Record<
  string,
  {
    icon: LucideIcon;
    title: string;
    description: string;
  }
>;

export type AiPlaceholderKind = keyof typeof placeholderConfig;

export function AiPlaceholder({
  kind,
  compact = false,
}: {
  kind: AiPlaceholderKind;
  compact?: boolean;
}) {
  const item = placeholderConfig[kind];
  const Icon = item.icon;

  return (
    <section
      className={`premium-card border-dashed p-5 ${compact ? 'min-h-36' : ''}`}
      aria-label={`${item.title} coming soon`}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary ai-breathing">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          <p className="mt-3 text-xs font-medium text-primary">AI architecture ready</p>
        </div>
      </div>
    </section>
  );
}
