import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IConsolidatedBalancesResponse, ProductGateway } from '@bancolombia/consolidated-balances-widget-web';
import { FilexProductsService } from './filex-products.service';

@Injectable({
  providedIn: 'root',
})
export class FilexSummaryWidgetService extends ProductGateway {
  private _filexProductsService = inject(FilexProductsService);

  getProductsType(): Observable<IConsolidatedBalancesResponse> {
    this._filexProductsService.refreshProductsSumary();
    return this._filexProductsService.getProductsSummary;
  }

  getProducts(): Observable<IConsolidatedBalancesResponse> {
    throw new Error('method will implemented');
  }
}
