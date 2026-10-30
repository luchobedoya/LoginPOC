import { TestBed } from '@angular/core/testing';
import { ONE } from '@svn/shared-utils-web';
import { DataTransformService } from './data-transform.service';

describe('DataTransformService', () => {
  let service: DataTransformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTransformService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapResponseData', () => {
    test('should return an empty object if the response is invalid', () => {
      const invalidResponse = null;
      const result = service.mapResponseData(invalidResponse);
      expect(result).toEqual({});
    });

    test('should correctly map the response data when the response is valid', () => {
      const validResponse = {
        status: { code: 200, msg: 'Success' },
        response: {
          products: {
            arrProducts: [
              {
                nameCategory: 'Créditos',
                iconCategory: 'cash-payment',
                dataProducts: [{ '1': 'Crédito 1', '2': ' ', '3': '200', '4': '100', productId: 'LOAN1' }],
                tooltip: '',
              },
            ],
          },
        },
      };

      const expectedMappedResponse = {
        status: { code: 200, msg: 'Success' },
        response: {
          products: {
            arrProducts: [
              {
                id: 1,
                nameCategory: 'Créditos',
                iconCategory: 'cash-payment',
                dataProducts: [
                  {
                    '1': 'Crédito 1',
                    '2': ' ',
                    '3': '200',
                    '4': '100',
                    productId: 'LOAN1',
                  },
                ],
                columns: [
                  { name: '', nameID: '', typeColumn: 'label', order: 1 },
                  { name: '', nameID: '', typeColumn: 'label', order: 2 },
                  {
                    name: 'Valor inicial',
                    nameID: 'CATOTA',
                    typeColumn: 'amount',
                    order: 3,
                    className: 'CIBFontSans-Bold',
                  },
                  {
                    name: 'Deuda a la fecha',
                    nameID: 'CATOTA',
                    typeColumn: 'amount',
                    order: 4,
                    className: 'bc-cibsans-font-style-2-bold bc-fw-bolder bc-fs-5',
                  },
                ],
                tooltip: '',
                productId: 'LOAN1',
              },
            ],
          },
        },
      };

      const result = service.mapResponseData(validResponse);
      expect(result).toEqual(expectedMappedResponse);
    });
  });

  describe('mapStatus', () => {
    test('should correctly map the status', () => {
      const response = { status: { code: 200, msg: 'Success' } };
      const expectedStatus = { code: 200, msg: 'Success' };
      const result = service['mapStatus'](response);
      expect(result).toEqual(expectedStatus);
    });
  });

  describe('mapProducts', () => {
    test('should map product data correctly', () => {
      const arrProducts = [
        {
          nameCategory: 'Cuentas depósito',
          iconCategory: 'capital',
          dataProducts: [{ '1': 'Depósito 1', '2': ' ', '3': '100', '4': '200', productId: 'DEPOSIT1' }],
          tooltip: '',
        },
      ];

      const result = service['mapProducts'](arrProducts);
      expect(result).toHaveLength(ONE);
      expect(result[0].nameCategory).toBe('Cuentas depósito');
    });
  });

  describe('getModifiedColumns', () => {
    test('should return modified columns for "Créditos"', () => {
      const result = service['getModifiedColumns']('Créditos');
      expect(result[2].name).toBe('Valor inicial');
    });

    test('should return default columns for other categories', () => {
      const result = service['getModifiedColumns']('Inversiones');
      expect(result[2].name).toBe('');
    });
  });
});
