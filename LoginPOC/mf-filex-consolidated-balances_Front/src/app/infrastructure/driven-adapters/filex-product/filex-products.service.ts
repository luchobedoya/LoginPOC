import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IConsolidatedBalancesResponse } from '@bancolombia/consolidated-balances-widget-web';
import { ONE } from '@svn/shared-utils-web';
import { BehaviorSubject, catchError, Observable, of, switchMap, take } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductsSummyFilexGateway } from '../../../domain/products-summy-filex/models/gateways/products-summy-filex-gateway';
import { FuncImplementationService } from '../../utils/services/func-implementation.service';
import { FilexProductsMapperService } from './mapper/filex-products-mapper.service';
import { ISummaryFilex } from './models/IFilexProductsSummary';

@Injectable({
  providedIn: 'root',
})
export class FilexProductsService implements ProductsSummyFilexGateway {
  private readonly _http = inject(HttpClient);
  private readonly _filexProductsMapperService = inject(FilexProductsMapperService);
  private readonly _funcService = inject(FuncImplementationService);
  private readonly _productsSummary$ = new BehaviorSubject<IConsolidatedBalancesResponse | null>(null);

  /**
   * Obtiene la información de los productos de filex y se transforma a la respuesta del widget.
   * @returns {Observable<IConsolidatedBalancesResponse>}
   */
  getFilexProducts(): Observable<IConsolidatedBalancesResponse> {
    const func = this._funcService.resolveFunc('consolidateBalancesFunc');
    return this._http
      .get(environment.filexSummyProductsURL, {
        headers: { 'feature-identifier': func },
      })
      .pipe(
        switchMap((response) => {
          const mappedResponse = this._filexProductsMapperService.dataMapperFilexProductsWidget(
            response as ISummaryFilex
          );
          this._productsSummary$.next(mappedResponse);
          return of(mappedResponse);
        }),
        catchError((err: HttpErrorResponse) => {
          const errorResponse = this._filexProductsMapperService.catchErrorStatus(err);
          this._productsSummary$.next(errorResponse);
          return of(errorResponse);
        })
      );
  }

  // /**
  //  * Retorna los productos obtenidos o los carga si aún no están en el BehaviorSubject.
  //  * @returns {Observable<IConsolidatedBalancesResponse>}
  //  */
  get getProductsSummary(): Observable<any> {
    return this._productsSummary$.asObservable();
  }
  refreshProductsSumary(): void {
    this._productsSummary$.next(null);
    this.getFilexProducts().pipe(take(ONE)).subscribe();
  }

  /**
   * Reinicia la información de los productos emitiendo `null` en el BehaviorSubject.
   * Esto puede provocar que los suscriptores se actualicen y reflejen un estado vacío.
   */
  clearProductsSummary(): void {
    this._productsSummary$.next(null);
  }
}
