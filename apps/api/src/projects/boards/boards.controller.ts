import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { WorkIdParam } from '../common/work-params';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsService } from './boards.service';

@Controller({ path: 'boards', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class BoardsController {
  constructor(private readonly boards: BoardsService) {}

  @Get()
  @RequirePermissions('Project.Read')
  list(@CurrentOrganisation() organisationId: string, @Query('projectId') projectId?: string) {
    return this.boards.list(organisationId, projectId);
  }

  @Post()
  @RequirePermissions('Project.Update')
  create(@CurrentOrganisation() organisationId: string, @Body() dto: CreateBoardDto) {
    return this.boards.create(organisationId, dto);
  }

  @Post('columns')
  @RequirePermissions('Project.Update')
  createColumn(@CurrentOrganisation() organisationId: string, @Body() dto: CreateBoardColumnDto) {
    return this.boards.createColumn(organisationId, dto);
  }

  @Delete(':id')
  @RequirePermissions('Project.Update')
  remove(@CurrentOrganisation() organisationId: string, @Param() params: WorkIdParam) {
    return this.boards.remove(organisationId, params.id);
  }
}
