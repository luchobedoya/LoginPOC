import { Observable } from 'rxjs';

import { LoginCredentials, User } from '../models/auth.model';

export abstract class AuthGateway {
  abstract login(credentials: LoginCredentials): Observable<User>;
}
