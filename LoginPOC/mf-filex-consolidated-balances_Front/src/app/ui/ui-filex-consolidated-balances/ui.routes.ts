import { Routes } from '@angular/router';
import { CONSOLIDATED_BALANCES_WIDGET_ROUTES } from '@bancolombia/consolidated-balances-widget-web';
import { validateAccessPricingGuard } from '@svn/shared-utils-web';
import { environment } from '../../../environments/environment';

const routeDataAccessGuard = {
  featureId: environment.featureIdConsolidated,
  urlEndpoint: environment.urlPricingAccessValidator,
  baseUrlPath: environment.mfBaseUrlConsolidated,
  mfRouteFlag: environment.fFlagConsolidated,
  denyBtnRoute: environment.denyBtnRoute,
  genericError: environment.genericError,
  isFilexMode: true,
};

export const FILEX_CONSOLIDATED_BALANCES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/filex-summary-balances/filex-summary-balances.component').then(
        (m) => m.FilexSummaryBalancesComponent
      ),
    canActivate: [validateAccessPricingGuard],
    children: CONSOLIDATED_BALANCES_WIDGET_ROUTES,
    data: { breadcrumb: 'Saldos consolidados - Consolidado', ...routeDataAccessGuard },
  },
];
