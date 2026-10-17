import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

import { AuthSessionGateway } from '../../domain/gateways/auth-session.gateway';
import { User } from '../../domain/models/auth.model';

export const AUTH_SESSION_KEY = 'login-poc.auth-session';

@Injectable({ providedIn: 'root' })
export class AuthSessionAdapter implements AuthSessionGateway {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly current = signal<User | null>(this.restore());
  readonly user = this.current.asReadonly();

  establish(user: User, rememberMe: boolean): void {
    this.current.set(user);
    this.write(user, rememberMe);
  }

  clear(): void {
    this.current.set(null);
    this.storage('local')?.removeItem(AUTH_SESSION_KEY);
    this.storage('session')?.removeItem(AUTH_SESSION_KEY);
  }

  private restore(): User | null {
    return this.read('session') ?? this.read('local');
  }

  private write(user: User, rememberMe: boolean): void {
    const active = rememberMe ? 'local' : 'session';
    const inactive = rememberMe ? 'session' : 'local';
    this.storage(inactive)?.removeItem(AUTH_SESSION_KEY);
    this.storage(active)?.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
  }

  private read(kind: 'local' | 'session'): User | null {
    const storage = this.storage(kind);
    const raw = storage?.getItem(AUTH_SESSION_KEY);
    if (!storage || !raw) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      if (isUser(parsed)) {
        return parsed;
      }
    } catch {
      // Drop a corrupted session instead of blocking the next login.
    }

    storage.removeItem(AUTH_SESSION_KEY);
    return null;
  }

  private storage(kind: 'local' | 'session'): Storage | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return kind === 'local' ? localStorage : sessionStorage;
  }
}

function isUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return ['id', 'username', 'displayName', 'email'].every(
    (key) => typeof candidate[key] === 'string' && candidate[key] !== '',
  );
}
