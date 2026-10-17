import { Routes } from '@angular/router';

import { LoginInitial } from './pages/login-initial/login-initial';

export const routes: Routes = [
  { path: '', component: LoginInitial },
  { path: '**', redirectTo: '' },
];
