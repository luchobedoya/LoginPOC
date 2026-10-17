import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './infrastructure/guards/auth.guard';
import { DashboardInitial } from './pages/dashboard-initial/dashboard-initial';
import { LoginInitial } from './pages/login-initial/login-initial';

export const routes: Routes = [
  { path: '', component: LoginInitial, canActivate: [guestGuard] },
  {
    path: 'dashboard',
    component: DashboardInitial,
    canActivate: [authGuard],
    title: 'Dashboard | Habit Studio',
  },
  { path: '**', redirectTo: '' },
];
