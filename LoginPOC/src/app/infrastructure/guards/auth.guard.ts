import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthSessionGateway } from '../../domain/gateways/auth-session.gateway';

export const authGuard: CanActivateFn = () => {
  const session = inject(AuthSessionGateway);
  return session.user() ? true : inject(Router).createUrlTree(['/']);
};

export const guestGuard: CanActivateFn = () => {
  const session = inject(AuthSessionGateway);
  return session.user() ? inject(Router).createUrlTree(['/dashboard']) : true;
};
