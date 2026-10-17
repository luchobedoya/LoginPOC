import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';

import { AuthGateway } from '../gateways/auth.gateway';
import { LoginCredentials, User } from '../models/auth.model';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let gateway: jasmine.SpyObj<AuthGateway>;

  const credentials: LoginCredentials = {
    username: 'demo',
    password: 'Login123!',
    rememberMe: true,
  };
  const user: User = {
    id: 'user-1',
    username: 'demo',
    displayName: 'Demo User',
    email: 'demo@example.com',
  };

  beforeEach(() => {
    gateway = jasmine.createSpyObj<AuthGateway>('AuthGateway', ['login']);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LoginUseCase,
        { provide: AuthGateway, useValue: gateway },
      ],
    });
    useCase = TestBed.inject(LoginUseCase);
  });

  it('should delegate credentials and return the gateway observable', async () => {
    const response$ = of(user);
    gateway.login.and.returnValue(response$);

    const result$ = useCase.execute(credentials);

    expect(gateway.login).toHaveBeenCalledOnceWith(credentials);
    expect(result$).toBe(response$);
    expect(await firstValueFrom(result$)).toEqual(user);
  });

  it('should propagate the gateway error', async () => {
    const error = new Error('Invalid username or password.');
    gateway.login.and.returnValue(throwError(() => error));

    await expectAsync(firstValueFrom(useCase.execute(credentials))).toBeRejectedWith(error);
  });
});
