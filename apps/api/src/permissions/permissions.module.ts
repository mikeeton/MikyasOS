import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PermissionsController],
  providers: [PermissionsService, JwtAuthGuard, OrganisationGuard],
  exports: [PermissionsService],
})
export class PermissionsModule {}
