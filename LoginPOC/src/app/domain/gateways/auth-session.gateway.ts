import { Signal } from '@angular/core';

import { User } from '../models/auth.model';

export abstract class AuthSessionGateway {
  abstract readonly user: Signal<User | null>;
  abstract establish(user: User, rememberMe: boolean): void;
  abstract clear(): void;
}
