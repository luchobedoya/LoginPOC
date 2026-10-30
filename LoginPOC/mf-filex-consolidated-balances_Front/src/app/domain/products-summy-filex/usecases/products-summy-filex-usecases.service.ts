import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsSummyFilexGateway } from '../models/gateways/products-summy-filex-gateway';
@Injectable({
  providedIn: 'root',
})
export class ProductsSummyFilexUsecasesService {
  private readonly _filexProductsGateway = inject(ProductsSummyFilexGateway);

  getProductsSummary(): Observable<any> {
    return this._filexProductsGateway.getProductsSummary;
  }

  refreshProductsSumary(): void {
    this._filexProductsGateway.refreshProductsSumary();
  }

  clearProductsSummary(): void {
    this._filexProductsGateway.clearProductsSummary();
  }
}
