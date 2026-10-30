import { inject, Injectable } from '@angular/core';

import { IConsolidatedBalancesResponse } from '@bancolombia/consolidated-balances-widget-web';

import { PdfBalancesGateway } from '../models/pdf-balances-gateway';

@Injectable({
  providedIn: 'root',
})
export class PdfBalancesUsecasesService {
  private readonly _pdfBalancesGateway = inject(PdfBalancesGateway);

  downloadBalancesFilexPDF(detailBalances: IConsolidatedBalancesResponse): Promise<void> {
    return this._pdfBalancesGateway.downloadBalancesFilexPDF(detailBalances);
  }
}
