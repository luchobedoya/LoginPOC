import { HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IConsolidatedBalancesResponse } from '@bancolombia/consolidated-balances-widget-web';

import { environment } from '../../../../environments/environment';
import { FuncImplementationService } from '../../utils/services/func-implementation.service';
import { FilexProductsService } from './filex-products.service';
import { FilexProductsMapperService } from './mapper/filex-products-mapper.service';

class MockFilexProductsMapperService {
  dataMapperFilexProductsWidget = jest.fn();
  catchErrorStatus = jest.fn();
}

describe('FilexProductsService', () => {
  let service: FilexProductsService;
  let mapperService: MockFilexProductsMapperService;
  let httpTestingController: HttpTestingController;
  const FuncImplementationServiceMock = {
    resolveFunc: jest.fn(),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FilexProductsService,
        { provide: FilexProductsMapperService, useClass: MockFilexProductsMapperService },
        { provide: FuncImplementationService, useValue: FuncImplementationServiceMock },
      ],
    });

    service = TestBed.inject(FilexProductsService);
    mapperService = TestBed.inject(FilexProductsMapperService) as unknown as MockFilexProductsMapperService;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    jest.clearAllMocks();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFilexProducts', () => {
    test('should getFilexProducts successfully', (done) => {
      (FuncImplementationServiceMock.resolveFunc as jest.Mock).mockReturnValue(environment.consolidateBalancesFunc);
      const mockResponse: IConsolidatedBalancesResponse = {
        status: {
          code: 200,
          msg: 'ok',
        },
        response: {
          products: {
            deposits: [
              {
                EUR: {
                  totalBalance: 7890.67,
                },
              },
            ],
            loans: [
              {
                USD: {
                  currentCapital: 1.0,
                  disbursementAmount: 20.0,
                },
              },
            ],
            investments: [
              {
                EUR: {
                  stock: 12345.69,
                },
              },
            ],
          },
        },
      };
      const mockMappedResponse: IConsolidatedBalancesResponse = {
        status: { code: 200, msg: 'Success' },
        response: {
          products: {
            deposits: [
              {
                EUR: {
                  totalBalance: 7890.67,
                },
              },
            ],
            loans: [
              {
                USD: {
                  currentCapital: 1.0,
                  disbursementAmount: 20.0,
                },
              },
            ],
            investments: [
              {
                EUR: {
                  stock: 12345.69,
                },
              },
            ],
          },
        },
      };

      mapperService.dataMapperFilexProductsWidget.mockReturnValue(mockMappedResponse);

      service.getFilexProducts().subscribe((response) => {
        expect(mapperService.dataMapperFilexProductsWidget).toHaveBeenCalledWith(mockResponse);
        expect(response).toEqual(mockMappedResponse);
        done();
      });

      const req = httpTestingController.expectOne(environment.filexSummyProductsURL);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('feature-identifier')).toBe(environment.consolidateBalancesFunc);
      req.flush(mockResponse);
    });

    test('should handle error in getFilexProducts', (done) => {
      (FuncImplementationServiceMock.resolveFunc as jest.Mock).mockReturnValue(environment.consolidateBalancesFunc);

      const errorStatus = HttpStatusCode.BadRequest;
      const errorStatusText = 'Mock Error';
      const mockErrorResponse: IConsolidatedBalancesResponse = {
        status: { code: errorStatus, msg: errorStatusText },
        response: {
          products: {},
        },
      };

      mapperService.catchErrorStatus.mockReturnValue(mockErrorResponse);

      service.getFilexProducts().subscribe((response) => {
        expect(mapperService.catchErrorStatus).toHaveBeenCalledWith(
          expect.objectContaining({ status: errorStatus, statusText: errorStatusText })
        );
        expect(response).toEqual(mockErrorResponse);
        done();
      });

      const req = httpTestingController.expectOne((request) => {
        return (
          request.url === environment.filexSummyProductsURL &&
          request.headers.get('feature-identifier') === environment.consolidateBalancesFunc
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush({}, { status: errorStatus, statusText: errorStatusText });
    });
  });

  describe('getProductsSummary', () => {
    test('should return getProductsSummary as observable', (done) => {
      const mockSummary: IConsolidatedBalancesResponse = {
        status: { code: 200, msg: 'Success' },
        response: {
          products: {
            deposits: [
              {
                EUR: {
                  totalBalance: 7890.67,
                },
              },
            ],
            loans: [
              {
                USD: {
                  currentCapital: 1.0,
                  disbursementAmount: 20.0,
                },
              },
            ],
            investments: [
              {
                EUR: {
                  stock: 12345.69,
                },
              },
            ],
          },
        },
      };
      service['_productsSummary$'].next(mockSummary);

      service.getProductsSummary.subscribe((summary) => {
        expect(summary).toEqual(mockSummary);
        done();
      });
    });
  });
});
