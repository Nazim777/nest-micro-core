import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { UserContext } from './auth.types';
@Injectable()
export class AuthService {
  private readonly clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });

  private jwtVerifyOptions(): Record<string, any> {
    return {
      secretKey: process.env.CLERK_SECRET_KEY,
    };
  }

  async verifyAndBuildContent(token: string): Promise<UserContext> {
    try {
      const verified: any = await verifyToken(token, this.jwtVerifyOptions());

      // decode payload
      const payload = verified?.payload ? verified?.payload : verified;

      const clerkuserId = payload?.sub ?? payload.userId;

      if (!clerkuserId) {
        throw new UnauthorizedException('Token is missing user id');
      }

      const role: 'user' | 'admin' = 'user';

      const emailFromToken =
        payload.email ??
        payload.email_address ??
        payload?.primaryEmailAddress ??
        '';
      const nameFromToken =
        payload.name ?? payload.fullName ?? payload.username ?? '';

      if (emailFromToken && nameFromToken) {
        return {
          clerkuserId,
          name: nameFromToken,
          email: emailFromToken,
          role,
        };
      }

      const user = await this.clerk.users.getUser(clerkuserId);
      const primaryEmail =
        user.emailAddresses.find((u) => u.id === user.primaryEmailAddressId)
          ?.emailAddress ??
        user.emailAddresses[0].emailAddress ??
        '';
      const fullName =
        [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        user.username ||
        primaryEmail ||
        clerkuserId;
      return {
        clerkuserId,
        email: emailFromToken || primaryEmail,
        name: nameFromToken || fullName,
        role,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
