import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { WorkIdParam } from '../common/work-params';
import { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import { CommentsService } from './comments.service';
import { CreateProjectCommentDto } from './dto/create-project-comment.dto';
import { UpdateProjectCommentDto } from './dto/update-project-comment.dto';

@Controller({ path: 'comments', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Get()
  @RequirePermissions('Project.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListWorkRecordsDto) {
    return this.comments.list(organisationId, query);
  }

  @Post()
  @RequirePermissions('Comments.Create')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProjectCommentDto,
  ) {
    return this.comments.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Comments.Create')
  update(
    @CurrentOrganisation() organisationId: string,
    @Param() params: WorkIdParam,
    @Body() dto: UpdateProjectCommentDto,
  ) {
    return this.comments.update(organisationId, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('Comments.Delete')
  remove(@CurrentOrganisation() organisationId: string, @Param() params: WorkIdParam) {
    return this.comments.remove(organisationId, params.id);
  }
}
