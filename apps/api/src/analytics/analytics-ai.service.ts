import { Injectable } from '@nestjs/common';

function architecture(service: string, purpose: string) {
  return { service, purpose, llmGenerationEnabled: false, predictiveModelEnabled: false };
}

@Injectable()
export class ExecutiveBriefingService {
  getArchitecture() {
    return architecture('ExecutiveBriefingService', 'Prepare CEO-ready business summaries.');
  }
}

@Injectable()
export class BusinessHealthService {
  getArchitecture() {
    return architecture(
      'BusinessHealthService',
      'Score company health from finance, CRM, projects, and operations.',
    );
  }
}

@Injectable()
export class ForecastService {
  getArchitecture() {
    return architecture(
      'ForecastService',
      'Prepare revenue, cash flow, sales, delivery, and resource forecasts.',
    );
  }
}

@Injectable()
export class RiskAnalysisService {
  getArchitecture() {
    return architecture(
      'RiskAnalysisService',
      'Detect projects, invoices, pipeline, and capacity risks.',
    );
  }
}

@Injectable()
export class RecommendationService {
  getArchitecture() {
    return architecture(
      'RecommendationService',
      'Prepare recommended executive actions without auto-execution.',
    );
  }
}

@Injectable()
export class TrendDetectionService {
  getArchitecture() {
    return architecture(
      'TrendDetectionService',
      'Prepare historical trend detection from snapshots and metric values.',
    );
  }
}
