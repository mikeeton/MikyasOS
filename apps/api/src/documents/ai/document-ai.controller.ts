import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { DocumentIdParamDto } from '../dto/document-id-param.dto';
import { DocumentAiService } from './document-ai.service';

@Controller({ path: 'documents', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class DocumentAiController {
  constructor(private readonly ai: DocumentAiService) {}

  @Get('ai/capabilities')
  @RequirePermissions('Document.Read')
  capabilities() {
    return this.ai.getCapabilities();
  }

  @Get('ai/prompt-templates')
  @RequirePermissions('Document.Read')
  promptTemplates() {
    return this.ai.getPromptTemplates();
  }

  @Get(':id/ai/readiness')
  @RequirePermissions('Document.Read')
  readiness(@CurrentOrganisation() _organisationId: string, @Param() params: DocumentIdParamDto) {
    return this.ai.getDocumentReadiness(params.id);
  }
}
