import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BcDialogService } from '@bancolombia/design-system-web/bc-services';
import { FOUR, ONE, ZERO } from '@svn/shared-utils-web';
import { AlertService } from '../../../utils/services/alert.service';
import { ISummaryFilex } from '../models/IFilexProductsSummary';
import { FilexProductsMapperService } from './filex-products-mapper.service';

describe('FilexProductsMapperService', () => {
  let service: FilexProductsMapperService;
  let alertServiceSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FilexProductsMapperService, AlertService, BcDialogService],
    });
    service = TestBed.inject(FilexProductsMapperService);
    alertServiceSpy = jest.spyOn(TestBed.inject(AlertService), 'showAlert').mockImplementation();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapProduct', () => {
    test('should map product data correctly with balances', () => {
      const productData = [{ COP: { totalBalance: 10000 }, USD: { totalBalance: 200 } }];
      const result = service.mapProduct(productData, 'DEPOSITS', 'Cuentas');

      expect(result).toEqual([
        { '1': 'Cuentas en COP', '2': ' ', '3': ' ', '4': 'COP  10.000,00', productId: 'DEPOSITS' },
        { '1': 'Cuentas en dólares', '2': ' ', '3': ' ', '4': 'USD $ 200,00', productId: 'DEPOSITS' },
      ]);
    });

    test('should handle loans with disbursement amount', () => {
      const productData = [{ USD: { totalBalance: 5000, disbursementAmount: 3000 } }];
      const result = service.mapProduct(productData, 'LOANS', 'Créditos');

      expect(result).toEqual([
        { '1': 'Créditos en dólares', '2': ' ', '3': 'USD $ 3.000,00', '4': 'USD $ 5.000,00', productId: 'LOANS' },
      ]);
    });
  });

  describe('formatCurrency', () => {
    test('should return "dólares" for USD', () => {
      expect(service['formatCurrency']('USD')).toBe('dólares');
    });

    test('should return "euros" for EUR', () => {
      expect(service['formatCurrency']('EUR')).toBe('euros');
    });

    test('should return "COP" for other currencies', () => {
      expect(service['formatCurrency']('COP')).toBe('COP');
    });
  });

  describe('catchErrorStatus', () => {
    test('should handle HttpErrorResponse correctly', () => {
      const mockError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        error: { errors: [{ code: '404', message: 'Resource not found' }] },
      });
      const status = 404;
      const result = service.catchErrorStatus(mockError);
      expect(result.status.code).toBe(status);
      expect(result.status.msg).toBe('404 - Resource not found');
    });

    test('should handle generic error correctly', () => {
      const mockError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });
      const status = 500;
      const result = service.catchErrorStatus(mockError);
      expect(result.status.code).toBe(status);
      expect(result.status.msg).toBe(' - Internal Server Error');
    });

    test('should handle error with empty errors array', () => {
      const mockError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: { errors: [] },
      });
      const status = 500;
      const result = service.catchErrorStatus(mockError);
      expect(result.status.code).toBe(status);
      expect(result.status.msg).toBe(' - Internal Server Error');
    });

    test('should handle error with no status', () => {
      const mockError = new HttpErrorResponse({
        status: 0,
        statusText: '',
      });

      const result = service.catchErrorStatus(mockError);
      expect(result.status.code).toBe(ZERO);
      expect(result.status.msg).toBe(' - Unknown Error');
    });

    test('should show single alert when only one product has error', () => {
      const productResponse = {
        data: {
          products: {
            deposits: [{ error: true }],
          },
        },
      } as ISummaryFilex;

      const result = service.dataMapperFilexProductsWidget(productResponse);

      expect(alertServiceSpy).toHaveBeenCalledTimes(ONE);
      expect(alertServiceSpy).toHaveBeenCalledWith(
        'warning',
        expect.any(String),
        expect.any(Number),
        expect.any(String)
      );

      expect(result.response.products.arrProducts).toHaveLength(ZERO);
    });

    test('should show combined alert when two products have error', () => {
      const productResponse = {
        data: {
          products: {
            deposits: [{ error: true }],
            loans: [{ error: true }],
          },
        },
      } as ISummaryFilex;

      const result = service.dataMapperFilexProductsWidget(productResponse);

      expect(alertServiceSpy).toHaveBeenCalledTimes(ONE);
      expect(alertServiceSpy).toHaveBeenCalledWith(
        'warning',
        'En este momento no pudimos mostrar los saldos de tus cuentas depósito y de tus créditos.',
        expect.any(Number),
        'Puedes intentarlo otra vez desde el botón de actualizar, ubicado en la parte superior derecha.'
      );

      expect(result.response.products.arrProducts).toHaveLength(ZERO);
    });
  });

  describe('createProduct', () => {
    test('should create a product with correct columns and data', () => {
      const productData = [{ COP: { totalBalance: 10000 }, USD: { totalBalance: 200 } }];

      const result = service['createProduct'](ONE, 'Cuentas depósito', 'capital', productData, 'DEPOSITS', 'Cuentas');

      expect(result.nameCategory).toBe('Cuentas depósito');
      expect(result.dataProducts).toEqual([
        { '1': 'Cuentas en COP', '2': ' ', '3': ' ', '4': 'COP  10.000,00', productId: 'DEPOSITS' },
        { '1': 'Cuentas en dólares', '2': ' ', '3': ' ', '4': 'USD $ 200,00', productId: 'DEPOSITS' },
      ]);
    });
  });

  describe('createColumns', () => {
    test('should create columns for loans with debt', () => {
      const columns = service['createColumns']('Deuda a la fecha', 'PRCAVI');
      expect(columns).toEqual([
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
          name: 'Deuda a la fecha',
          nameID: 'PRCAVI',
          typeColumn: 'amount',
          order: 4,
          className: 'bc-cibsans-font-style-4-bold bc-mt-2',
        },
      ]);
    });

    test('should create default columns for other products', () => {
      const columns = service['createColumns']('Saldo total', 'CATOTA');
      expect(columns).toEqual([
        { name: '', nameID: '', typeColumn: 'label', order: 1 },
        { name: '', nameID: '', typeColumn: 'label', order: 2 },
        { name: '', nameID: '', typeColumn: 'label', order: 3 },
        {
          name: 'Saldo total',
          nameID: 'CATOTA',
          typeColumn: 'amount',
          order: 4,
          className: 'bc-cibsans-font-style-4-bold bc-mt-2',
        },
      ]);
    });

    test('should create columns with debt for loans', () => {
      const result = service['createColumns']('Deuda a la fecha', 'PRCAVI');
      expect(result).toHaveLength(FOUR);
      expect(result[3].name).toBe('Deuda a la fecha');
    });

    test('should create default columns for other products 2', () => {
      const result = service['createColumns']('Saldo total', 'CATOTA');
      expect(result).toHaveLength(FOUR);
      expect(result[3].name).toBe('Saldo total');
    });
  });

  describe('simbolCurrency', () => {
    test('should return $ for USD', () => {
      const result = service['simbolCurrency']('USD');
      expect(result).toBe('$');
    });

    test('should return € for EUR', () => {
      const result = service['simbolCurrency']('EUR');
      expect(result).toBe('€');
    });

    test('should return empty string for other currencies', () => {
      const result = service['simbolCurrency']('COP');
      expect(result).toBe('');
    });
  });
  describe('dataMapperFilexProductsWidget', () => {
    test('should map deposits correctly', () => {
      const productResponse = {
        data: {
          products: {
            deposits: [{ USD: { totalBalance: 10000 } }],
          },
        },
      } as ISummaryFilex;

      const result = service.dataMapperFilexProductsWidget(productResponse);

      expect(result.response.products.arrProducts).toHaveLength(ONE);
      expect(result.response.products.arrProducts[0].nameCategory).toBe('Cuentas depósito');
    });

    test('should return empty products when no products are available', () => {
      const productResponse = {
        data: {
          products: {},
        },
      } as ISummaryFilex;

      const result = service.dataMapperFilexProductsWidget(productResponse);

      expect(result.response.products.arrProducts).toHaveLength(ZERO);
    });
  });
});
