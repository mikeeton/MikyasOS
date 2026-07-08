import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { OrganisationsModule } from '../organisations/organisations.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OrganisationGuard } from './guards/organisation.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    OrganisationsModule,
    PermissionsModule,
    SessionsModule,
    AuditLogsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    JwtAuthGuard,
    OrganisationGuard,
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [
    AuthService,
    PasswordService,
    TokenService,
    JwtAuthGuard,
    OrganisationGuard,
    RolesGuard,
    PermissionsGuard,
  ],
})
export class AuthModule {}
