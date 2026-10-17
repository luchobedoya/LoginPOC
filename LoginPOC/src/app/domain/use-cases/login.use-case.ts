import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthGateway } from '../gateways/auth.gateway';
import { LoginCredentials, User } from '../models/auth.model';

@Injectable()
export class LoginUseCase {
  private readonly authGateway = inject(AuthGateway);

  execute(credentials: LoginCredentials): Observable<User> {
    return this.authGateway.login(credentials);
  }
}
