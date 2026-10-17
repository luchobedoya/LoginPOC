import { TestBed } from '@angular/core/testing';

import { appConfig } from './app.config';
import { AuthGateway } from './domain/gateways/auth.gateway';
import { AuthSessionGateway } from './domain/gateways/auth-session.gateway';
import { HabitGateway } from './domain/gateways/habit.gateway';
import { GetDashboardStatsUseCase } from './domain/use-cases/get-dashboard-stats.use-case';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { AuthMockAdapter } from './infrastructure/driver-adapters/auth-mock.adapter';
import { AuthSessionAdapter } from './infrastructure/driver-adapters/auth-session.adapter';
import { HabitMockAdapter } from './infrastructure/driver-adapters/habit-mock.adapter';

describe('authentication providers', () => {
  it('should resolve the use case and reuse the root mock adapter for the gateway', () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });

    expect(TestBed.inject(LoginUseCase)).toBeInstanceOf(LoginUseCase);
    expect(TestBed.inject(AuthGateway)).toBe(TestBed.inject(AuthMockAdapter));
    expect(TestBed.inject(AuthSessionGateway)).toBe(TestBed.inject(AuthSessionAdapter));
  });
});

describe('habit providers', () => {
  it('should resolve the dashboard use case and reuse the root habit adapter', () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
    expect(TestBed.inject(GetDashboardStatsUseCase)).toBeInstanceOf(GetDashboardStatsUseCase);
    expect(TestBed.inject(HabitGateway)).toBe(TestBed.inject(HabitMockAdapter));
  });
});
