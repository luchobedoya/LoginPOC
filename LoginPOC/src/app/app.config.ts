import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthGateway } from './domain/gateways/auth.gateway';
import { AuthSessionGateway } from './domain/gateways/auth-session.gateway';
import { HabitGateway } from './domain/gateways/habit.gateway';
import { GetDashboardStatsUseCase } from './domain/use-cases/get-dashboard-stats.use-case';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { AuthMockAdapter } from './infrastructure/driver-adapters/auth-mock.adapter';
import { AuthSessionAdapter } from './infrastructure/driver-adapters/auth-session.adapter';
import { HabitMockAdapter } from './infrastructure/driver-adapters/habit-mock.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    LoginUseCase,
    { provide: AuthGateway, useExisting: AuthMockAdapter },
    { provide: AuthSessionGateway, useExisting: AuthSessionAdapter },
    GetDashboardStatsUseCase,
    { provide: HabitGateway, useExisting: HabitMockAdapter },
  ],
};
