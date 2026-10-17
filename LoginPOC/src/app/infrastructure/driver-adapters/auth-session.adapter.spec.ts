import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { User } from '../../domain/models/auth.model';
import { AUTH_SESSION_KEY, AuthSessionAdapter } from './auth-session.adapter';

describe('AuthSessionAdapter', () => {
  let adapter: AuthSessionAdapter;

  const user: User = {
    id: 'mock-user-1',
    username: 'demo',
    displayName: 'Demo User',
    email: 'demo@example.com',
  };

  beforeEach(() => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    adapter = TestBed.inject(AuthSessionAdapter);
  });

  afterEach(() => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  });

  it('should start without a session', () => {
    expect(adapter.user()).toBeNull();
  });

  it('should keep a session for the current tab when remember me is off', () => {
    adapter.establish(user, false);

    expect(adapter.user()).toEqual(user);
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toContain('"username":"demo"');
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('should remember the session across adapter instances when remember me is on', () => {
    adapter.establish(user, true);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });

    expect(TestBed.inject(AuthSessionAdapter).user()).toEqual(user);
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('should replace a remembered session when the next login is only for this tab', () => {
    adapter.establish(user, true);
    adapter.establish({ ...user, username: 'other' }, false);

    expect(adapter.user()?.username).toBe('other');
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toContain('"username":"other"');
  });

  it('should clear the in-memory session and both storages', () => {
    adapter.establish(user, true);
    adapter.clear();

    expect(adapter.user()).toBeNull();
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('should ignore a corrupted stored session', () => {
    localStorage.setItem(AUTH_SESSION_KEY, '{not-json');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });

    expect(TestBed.inject(AuthSessionAdapter).user()).toBeNull();
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });
});
