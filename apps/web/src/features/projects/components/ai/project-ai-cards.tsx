import {
  BrainCircuit,
  CalendarClock,
  ChartNoAxesCombined,
  Gauge,
  Network,
  Sparkles,
  UsersRound,
} from 'lucide-react';

const projectAiCards = [
  {
    title: 'AI Project Summary',
    description: 'Executive, sprint, team, daily, and weekly summary architecture.',
    icon: Sparkles,
  },
  {
    title: 'AI Recommendations',
    description: 'Task priority, assignee, completion, and planning recommendation hooks.',
    icon: BrainCircuit,
  },
  {
    title: 'AI Risks',
    description: 'Risk scoring, deadline prediction, blockers, and delivery confidence plans.',
    icon: Gauge,
  },
  {
    title: 'AI Timeline',
    description: 'Critical path, dependency graph, and risk propagation readiness.',
    icon: CalendarClock,
  },
  {
    title: 'AI Workload',
    description: 'Capacity, task distribution, burnout risk, and unused capacity signals.',
    icon: ChartNoAxesCombined,
  },
  {
    title: 'AI Team Insights',
    description: 'Team summaries, ownership insights, and support-needed architecture.',
    icon: UsersRound,
  },
  {
    title: 'AI Blockers',
    description: 'Blocked task detection and downstream impact preparation.',
    icon: Network,
  },
];

export function ProjectAiCards({ limit = projectAiCards.length }: { limit?: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {projectAiCards.slice(0, limit).map((card) => {
        const Icon = card.icon;
        return (
          <section key={card.title} className="premium-card project-ai-card border-dashed p-4">
            <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold">{card.title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{card.description}</p>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Architecture ready · execution off
            </p>
          </section>
        );
      })}
    </div>
  );
}
