import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IConsolidatedBalancesResponse } from '@bancolombia/consolidated-balances-widget-web';
import { ONE, THREE, TWO, ZERO } from '@svn/shared-utils-web';
import { DEFAULT_TIMEOUT_ALERTS } from '../../../../core/utils/constants/number-constant';
import {
  errorMessage,
  errorTitlecredit,
  errorTitledeposit,
  errorTitleinvestment,
} from '../../../utils/constant/errorConstans';
import { AlertService } from '../../../utils/services/alert.service';
import { ISummaryFilex } from '../models/IFilexProductsSummary';
import { ProductTypeConfig } from '../models/IProductTypeConfig';

@Injectable({
  providedIn: 'root',
})
export class FilexProductsMapperService {
  private readonly _alertService = inject(AlertService);

  mapProduct = (productData: any[], productId: string, productName: string) => {
    return productData.flatMap((product) =>
      Object.keys(product).map((currency) => {
        const balance =
          product[currency].totalBalance || product[currency].currentCapital || product[currency].stock || ZERO;
        const balanceWithComma = balance.toLocaleString('es-CO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        let disbursementAmountText = '';

        if (
          productId === 'LOANS' &&
          product[currency].disbursementAmount !== undefined &&
          product[currency].disbursementAmount !== null
        ) {
          const disbursementAmount = product[currency].disbursementAmount;
          const disbursementWithComma = disbursementAmount.toLocaleString('es-CO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          disbursementAmountText = `${currency} ${this.simbolCurrency(currency)} ${disbursementWithComma}`;
        }

        return {
          '1': `${productName} en ${this.formatCurrency(currency)}`,
          '2': ` `,
          '3': disbursementAmountText || ` `,
          '4': `${currency} ${this.simbolCurrency(currency)} ${balanceWithComma}`,
          productId: productId,
        };
      })
    );
  };

  private formatCurrency(balance: string): string {
    let currencySymbol = 'COP';

    if (balance.includes('USD')) {
      currencySymbol = 'dólares';
    } else if (balance.includes('EUR')) {
      currencySymbol = 'euros';
    }
    return currencySymbol;
  }

  private simbolCurrency(balance: string): string {
    let currencySymbol = '';

    if (balance.includes('USD')) {
      currencySymbol = '$';
    } else if (balance.includes('EUR')) {
      currencySymbol = '€';
    }
    return currencySymbol;
  }

  dataMapperFilexProductsWidget(productResponse: ISummaryFilex): IConsolidatedBalancesResponse {
    const products: any[] = [];
    const productTypes: ProductTypeConfig[] = [
      this.filexDepositProducts(),
      this.filexCreditProducts(),
      this.filexInvestmentProducts(),
    ];

    const errorProducts: { errorTitle: string; errorMsg: string; label: string }[] = [];

    productTypes.forEach(({ key, id, label, icon, group, title, errorTitle, errorMsg }) => {
      const items = productResponse?.data?.products?.[key];
      if (items) {
        if (items[ZERO]?.error) {
          errorProducts.push({ errorTitle, errorMsg, label });
        } else {
          products.push(this.createProduct(id, label, icon, items, group, title));
        }
      }
    });

    if (errorProducts.length === ONE) {
      const { errorTitle, errorMsg } = errorProducts[0];
      this._alertService.showAlert('warning', errorTitle, DEFAULT_TIMEOUT_ALERTS, errorMsg);
    } else if (errorProducts.length >= TWO) {
      const productLabels = errorProducts.map((p) => p.label.toLowerCase());
      const combinedMsg = `En este momento no pudimos mostrar los saldos de tus ${productLabels.join(' y de tus ')}.`;
      this._alertService.showAlert('warning', combinedMsg, DEFAULT_TIMEOUT_ALERTS, errorMessage);
    }

    return {
      status: this.createStatus(productResponse),
      response: {
        products: {
          arrProducts: products,
        },
      },
    };
  }

  private filexDepositProducts(): ProductTypeConfig {
    return {
      key: 'deposits',
      id: ONE,
      label: 'Cuentas depósito',
      icon: 'capital',
      group: 'DEPOSITS',
      title: 'Cuentas',
      errorMsg: errorMessage,
      errorTitle: errorTitledeposit,
    };
  }

  private filexCreditProducts(): ProductTypeConfig {
    return {
      key: 'loans',
      id: TWO,
      label: 'Créditos',
      icon: 'cash-payment',
      group: 'LOANS',
      title: 'Créditos',
      errorMsg: errorMessage,
      errorTitle: errorTitlecredit,
    };
  }

  private filexInvestmentProducts(): ProductTypeConfig {
    return {
      key: 'investments',
      id: THREE,
      label: 'Inversiones',
      icon: 'chart-line',
      group: 'INVESTMENTS',
      title: 'Inversiones',
      errorMsg: errorMessage,
      errorTitle: errorTitleinvestment,
    };
  }

  private createStatus(productResponse: ISummaryFilex) {
    if (productResponse) {
      return {
        code: 200,
        msg: 'Operación exitosa',
      };
    }
    return {
      code: 400,
      msg: 'Ocurrió un error',
    };
  }

  private createProduct(
    id: number,
    nameCategory: string,
    iconCategory: string,
    productData: any,
    productId: string,
    productName: string
  ) {
    const { columnName, columnNameID } = this.mainColumns(productName);

    return {
      id: id,
      nameCategory: nameCategory,
      iconCategory: iconCategory,
      dataProducts: this.mapProduct(productData, productId, productName),
      columns: this.createColumns(columnName, columnNameID),
      tooltip: '',
      productId: productId,
    };
  }

  private mainColumns(productName: string): { columnName: string; columnNameID: string } {
    let columnName = '';
    let columnNameID = '';

    switch (productName) {
      case 'Cuentas':
        columnName = 'Saldo total';
        columnNameID = 'CATOTA';
        break;
      case 'Créditos':
        columnName = 'Deuda a la fecha';
        columnNameID = 'PRCAVI';
        break;
      case 'Inversiones':
        columnName = 'Capital';
        columnNameID = 'INVVAL';
        break;
      default:
        columnName = 'Total';
        columnNameID = 'CATOTA';
    }

    return { columnName, columnNameID };
  }

  private createColumns(columnName: string, columnNameID: string) {
    if (columnName === 'Deuda a la fecha') {
      return [
        { name: '', nameID: '', typeColumn: 'label', order: 1 },
        { name: '', nameID: '', typeColumn: 'label', order: 2 },
        {
          name: 'Valor inicial',
          nameID: '',
          typeColumn: 'amount',
          order: 4,
          className: 'bc-opensans-font-style-2-regular',
        },
        {
          name: columnName,
          nameID: columnNameID,
          typeColumn: 'amount',
          order: 4,
          className: 'bc-cibsans-font-style-4-bold bc-mt-2',
        },
      ];
    }
    return [
      { name: '', nameID: '', typeColumn: 'label', order: 1 },
      { name: '', nameID: '', typeColumn: 'label', order: 2 },
      { name: '', nameID: '', typeColumn: 'label', order: 3 },
      {
        name: columnName,
        nameID: columnNameID,
        typeColumn: 'amount',
        order: 4,
        className: 'bc-cibsans-font-style-4-bold bc-mt-2',
      },
    ];
  }

  catchErrorStatus(error: HttpErrorResponse): IConsolidatedBalancesResponse {
    let codeStatus;
    let errorCode = '';
    let errorMessage = '';

    if (error) {
      codeStatus = error.status;
      errorMessage = error.statusText;

      if (error.error && error.error.errors && error.error.errors.length > ZERO) {
        errorCode = error.error.errors[0].code;
        errorMessage = error.error.errors[0].message;
      }
    } else {
      codeStatus = error;
      errorMessage = 'error';
    }

    const combinedMessage = `${errorCode} - ${errorMessage}`;

    return convertDataToWidget(Number(codeStatus), combinedMessage, []);
  }
}

const convertDataToWidget = (code: number, message: string, arrayProducts: []): IConsolidatedBalancesResponse => {
  return {
    status: { code, msg: message },
    response: {
      products: { arrProducts: arrayProducts },
    },
  } as IConsolidatedBalancesResponse;
};
