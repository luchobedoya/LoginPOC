import { Routes } from '@angular/router';
import { FILEX_CONSOLIDATED_BALANCES_ROUTES } from './ui/ui-filex-consolidated-balances/ui.routes';

export const routes: Routes = [
  {
    path: '',
    children: FILEX_CONSOLIDATED_BALANCES_ROUTES,
  },
];
