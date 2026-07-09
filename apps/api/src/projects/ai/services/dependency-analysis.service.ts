import { Injectable } from '@nestjs/common';

import type { DependencyAnalysisPlan } from '../project-ai.types';

@Injectable()
export class DependencyAnalysisService {
  getDependencyPlans(): DependencyAnalysisPlan[] {
    return [
      {
        key: 'critical-path',
        signals: ['taskDependenciesFuture', 'milestones', 'dueDates', 'status'],
        outputShape: ['criticalPath', 'constraintTasks', 'deliveryImpact'],
      },
      {
        key: 'dependency-graph',
        signals: ['parentTasks', 'dependencyEdgesFuture', 'milestones'],
        outputShape: ['nodes', 'edges', 'orphanedWork'],
      },
      {
        key: 'circular-dependency-detection',
        signals: ['dependencyEdgesFuture'],
        outputShape: ['cycles', 'affectedTasks', 'resolutionHints'],
      },
      {
        key: 'missing-dependencies',
        signals: ['taskSequence', 'comments', 'milestones', 'statusChanges'],
        outputShape: ['candidateDependencies', 'confidence', 'reasoning'],
      },
      {
        key: 'risk-propagation',
        signals: ['blockedTasks', 'dependenciesFuture', 'milestoneChain'],
        outputShape: ['downstreamRisks', 'affectedMilestones', 'priorityImpact'],
      },
    ];
  }
}
