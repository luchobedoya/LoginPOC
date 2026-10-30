import { Injectable } from '@angular/core';
import { ONE } from '@svn/shared-utils-web';

@Injectable({
  providedIn: 'root',
})
export class DataTransformService {
  mapResponseData(response: any): any {
    if (!this.isValidResponse(response)) {
      return {};
    }

    return {
      status: this.mapStatus(response),
      response: {
        products: {
          arrProducts: this.mapProducts(response.response.products.arrProducts),
        },
      },
    };
  }

  private isValidResponse(response: any): boolean {
    return response && response.status && response.response && response.response.products;
  }

  private mapStatus(response: any): { code: number; msg: string } {
    return {
      code: response.status.code,
      msg: response.status.msg,
    };
  }

  private mapProducts(arrProducts: any[]): any[] {
    return arrProducts.flatMap((product: any, index: number) =>
      this.mapProductData(product, index, arrProducts.length)
    );
  }

  private mapProductData(product: any, index: number, length: number): any[] {
    return product.dataProducts.map((dataProduct: any, dataIndex: number) => {
      return {
        id: this.generateId(index, dataIndex, length),
        nameCategory: product.nameCategory,
        iconCategory: product.iconCategory,
        dataProducts: this.mapDataProducts(dataProduct),
        columns: this.getModifiedColumns(product.nameCategory),
        tooltip: product.tooltip || '',
        productId: dataProduct.productId,
      };
    });
  }

  private generateId(index: number, dataIndex: number, length: number): number {
    return index * length + dataIndex + ONE;
  }

  private mapDataProducts(dataProduct: any): any[] {
    return [
      {
        '1': dataProduct['1'],
        '2': dataProduct['2'],
        '3': dataProduct['3'],
        '4': dataProduct['4'],
        productId: dataProduct.productId,
      },
    ];
  }

  private getModifiedColumns(nameCategory: string): any[] {
    const columns = this.getColumns(nameCategory);
    const two = 2;
    if (nameCategory === 'Créditos') {
      columns[two] = {
        name: 'Valor inicial',
        nameID: 'CATOTA',
        typeColumn: 'amount',
        order: 3,
        className: 'CIBFontSans-Bold',
      };
    }

    return columns;
  }

  private getColumns(nameCategory: string): any[] {
    return [
      { name: '', nameID: '', typeColumn: 'label', order: 1 },
      { name: '', nameID: '', typeColumn: 'label', order: 2 },
      { name: '', nameID: '', typeColumn: 'label', order: 3 },
      {
        name: this.getColumnLabel(nameCategory),
        nameID: this.getColumnNameID(nameCategory),
        typeColumn: 'amount',
        order: 4,
        className: 'bc-cibsans-font-style-2-bold bc-fw-bolder bc-fs-5',
      },
    ];
  }

  private getColumnLabel(nameCategory: string): string {
    switch (nameCategory) {
      case 'Cuentas depósito':
        return 'Saldo total';
      case 'Créditos':
        return 'Deuda a la fecha';
      case 'Inversiones':
        return 'Capital';
      default:
        return '';
    }
  }

  private getColumnNameID(nameCategory: string): string {
    switch (nameCategory) {
      case 'Cuentas depósito':
        return 'CATOTA';
      case 'Créditos':
        return 'CATOTA';
      case 'Inversiones':
        return 'CATOTA';
      default:
        return '';
    }
  }
}
