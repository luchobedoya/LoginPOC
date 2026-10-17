import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';

import { AuthSessionGateway } from '../../domain/gateways/auth-session.gateway';
import { User } from '../../domain/models/auth.model';
import { authGuard, guestGuard } from './auth.guard';

describe('auth guards', () => {
  const user: User = {
    id: 'mock-user-1',
    username: 'demo',
    displayName: 'Demo User',
    email: 'demo@example.com',
  };
  const currentUser = signal<User | null>(null);
  const session = jasmine.createSpyObj<AuthSessionGateway>(
    'AuthSessionGateway',
    ['establish', 'clear'],
    { user: currentUser },
  );

  beforeEach(() => {
    currentUser.set(null);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthSessionGateway, useValue: session },
      ],
    });
  });

  function allow(guard: typeof authGuard): boolean | string {
    const result = TestBed.runInInjectionContext(() => guard(null as never, null as never));
    if (result === true) {
      return true;
    }

    return TestBed.inject(Router).serializeUrl(result as UrlTree);
  }

  it('should send an anonymous visitor from the dashboard back to login', () => {
    expect(allow(authGuard)).toBe('/');
  });

  it('should allow the dashboard when a session exists', () => {
    currentUser.set(user);
    expect(allow(authGuard)).toBeTrue();
  });

  it('should allow an anonymous visitor to stay on the login page', () => {
    expect(allow(guestGuard)).toBeTrue();
  });

  it('should send an authenticated visitor from login to the dashboard', () => {
    currentUser.set(user);
    expect(allow(guestGuard)).toBe('/dashboard');
  });
});
