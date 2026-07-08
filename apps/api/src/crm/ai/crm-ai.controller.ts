import { Controller, Get, UseGuards } from '@nestjs/common';

import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { customerPromptTemplates } from './customer-prompt-templates';
import { CustomerInsightService } from './customer-insight.service';

@Controller({ path: 'crm/ai', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class CrmAiController {
  constructor(private readonly insights: CustomerInsightService) {}

  @Get('capabilities')
  @RequirePermissions('crm:read')
  capabilities() {
    return this.insights.getCapabilities();
  }

  @Get('prompt-templates')
  @RequirePermissions('crm:read')
  promptTemplates() {
    return {
      templates: customerPromptTemplates,
      promptExecutionEnabled: false,
    };
  }
}
