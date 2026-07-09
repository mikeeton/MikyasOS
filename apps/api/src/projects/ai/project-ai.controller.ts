import { Controller, Get, UseGuards } from '@nestjs/common';

import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { ProjectAiService } from './project-ai.service';

@Controller({ path: 'projects/ai', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class ProjectAiController {
  constructor(private readonly projectAi: ProjectAiService) {}

  @Get('capabilities')
  @RequirePermissions('Project.Read')
  capabilities() {
    return this.projectAi.getCapabilities();
  }

  @Get('prompt-templates')
  @RequirePermissions('Project.Read')
  promptTemplates() {
    return this.projectAi.getPromptTemplates();
  }
}
