import { Injectable } from '@angular/core';
import { Observable, map, timer } from 'rxjs';

import { AuthGateway } from '../../domain/gateways/auth.gateway';
import { LoginCredentials, User } from '../../domain/models/auth.model';
import { toLoginRequestDTO, toUser } from '../../utils/mappers/auth.mapper';
import { LoginResponseDTO } from '../dtos/auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthMockAdapter implements AuthGateway {
  login(credentials: LoginCredentials): Observable<User> {
    const request = toLoginRequestDTO(credentials);

    return timer(800).pipe(
      map(() => {
        // Demo credentials only. A real backend must perform authentication.
        if (request.username !== 'demo' || request.password !== 'Login123!') {
          throw new Error('Invalid username or password.');
        }

        const response: LoginResponseDTO = {
          user: {
            user_id: 'mock-user-1',
            username: request.username,
            display_name: 'Demo User',
            email: 'demo@example.com',
          },
        };

        return toUser(response);
      }),
    );
  }
}
