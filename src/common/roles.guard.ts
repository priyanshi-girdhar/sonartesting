import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';  // Ensure the path is correct
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtAuthGuard: JwtAuthGuard,  // Inject JwtAuthGuard to ensure auth is handled first
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, ensure the user is authenticated using JwtAuthGuard
    const isAuthenticated = await this.jwtAuthGuard.canActivate(context);
    if (!isAuthenticated) return false;

    // Retrieve the required roles from the handler or class
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) return true;

    // Get the user from the request object (set by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Check if the user has one of the required roles
    return requiredRoles.includes(user.role);
  }
}
