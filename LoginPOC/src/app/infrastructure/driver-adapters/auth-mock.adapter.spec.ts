import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';

import { LoginCredentials, User } from '../../domain/models/auth.model';
import { AuthMockAdapter } from './auth-mock.adapter';

describe('AuthMockAdapter', () => {
  let adapter: AuthMockAdapter;
  let scheduler: TestScheduler;

  const credentials: LoginCredentials = {
    username: 'demo',
    password: 'Login123!',
    rememberMe: false,
  };
  const user: User = {
    id: 'mock-user-1',
    username: 'demo',
    displayName: 'Demo User',
    email: 'demo@example.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    adapter = TestBed.inject(AuthMockAdapter);
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('should emit a mapped user and complete after 800 ms', () => {
    scheduler.run(({ expectObservable }) => {
      expectObservable(adapter.login(credentials)).toBe('800ms (u|)', { u: user });
    });
  });

  it('should also accept valid credentials with rememberMe enabled', () => {
    scheduler.run(({ expectObservable }) => {
      expectObservable(adapter.login({ ...credentials, rememberMe: true })).toBe('800ms (u|)', {
        u: user,
      });
    });
  });

  for (const invalid of [
    { ...credentials, username: 'unknown' },
    { ...credentials, password: 'Wrong123!' },
    { ...credentials, username: '', password: '' },
  ]) {
    it(`should reject invalid credentials after 800 ms (${invalid.username || 'empty'})`, () => {
      scheduler.run(({ expectObservable }) => {
        expectObservable(adapter.login(invalid)).toBe(
          '800ms #',
          undefined,
          new Error('Invalid username or password.'),
        );
      });
    });
  }

  it('should cancel the pending response when unsubscribed', () => {
    scheduler.run(({ expectObservable }) => {
      expectObservable(adapter.login(credentials), '400ms !').toBe('');
    });
  });
});
