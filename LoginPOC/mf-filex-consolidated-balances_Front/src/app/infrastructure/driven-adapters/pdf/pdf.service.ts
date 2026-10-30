import { inject, Injectable } from '@angular/core';

import { IConsolidatedBalancesResponse } from '@bancolombia/consolidated-balances-widget-web';

import { AlertService } from '../../utils/services/alert.service';

import { UserDataUseCase } from '@svn/auth-lib';
import { ONE, PdfUtilsService, ProductCategoryItemPdf, THREE, ZERO } from '@svn/shared-utils-web';
import { DEFAULT_TIMEOUT_ALERTS } from '../../../core/utils/constants/number-constant';
import { PdfBalancesGateway } from '../../../domain/pdf-balances/models/pdf-balances-gateway';
import {
  COLUMN_BALANCES_STYLES,
  PDF_MESSAGES_ALERT,
  PDF_NAME_TO_EXPORT,
  TITLE_PRODUCTS_SUMMARY_FILEX_PDF,
} from '../../utils/constant/pdf-template-constants';
import { extractValueFromCurrency } from '../../utils/mappers/extract-value-currency';

@Injectable({
  providedIn: 'root',
})
export class PdfService extends PdfBalancesGateway {
  private readonly _alertService = inject(AlertService);
  private readonly _userDataUseCase = inject(UserDataUseCase);
  private readonly _pdfUtilsService = inject(PdfUtilsService);

  async downloadBalancesFilexPDF(productSummary: IConsolidatedBalancesResponse): Promise<void> {
    this._alertService.showAlert('warning', PDF_MESSAGES_ALERT.warning, DEFAULT_TIMEOUT_ALERTS);
    const userData = this._userDataUseCase.getUserData();
    await this._pdfUtilsService
      .drawPDFHeader()
      .drawPDFSubTitle(TITLE_PRODUCTS_SUMMARY_FILEX_PDF)
      .drawPDFInfo({
        user: userData.companyName,
        [userData.documentType]: userData.companyId,
      })
      .drawPDFFooter()
      .drawPDFProductCategories(this.getSummaryCategories(productSummary))
      .downloadPDF(PDF_NAME_TO_EXPORT);
    this._alertService.showAlert('success', PDF_MESSAGES_ALERT.success, DEFAULT_TIMEOUT_ALERTS);
  }

  private getSummaryCategories(productSummary: IConsolidatedBalancesResponse): ProductCategoryItemPdf[] {
    return productSummary.response.products.arrProducts.map((product: any) => ({
      category: product.dataProducts[ZERO][ONE],
      items: product.columns
        .filter((balance: any) => balance.name)
        .map((balance: any) => {
          const valueCurrency = product.dataProducts[ZERO][balance.order];
          const currency = valueCurrency.substring(ZERO, THREE);
          return {
            label: balance.name,
            value: extractValueFromCurrency(valueCurrency),
            value_font_family: COLUMN_BALANCES_STYLES[balance.nameID]?.style,
            value_font_size: COLUMN_BALANCES_STYLES[balance.nameID]?.size,
            currency,
          };
        }),
    }));
  }
}
