import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IConsolidatedBalancesResponse } from '@bancolombia/consolidated-balances-widget-web';
import { of } from 'rxjs';
import { FilexProductsService } from './filex-products.service';
import { FilexSummaryWidgetService } from './filex-summary-widget.service';

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
class MockFilexProductsService {
  refreshProductsSumary = jest.fn();
  getProductsSummary = of(mockSummary);
}

describe('FilexSummaryWidgetService', () => {
  let service: FilexSummaryWidgetService;
  let filexProductsService: MockFilexProductsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FilexSummaryWidgetService, { provide: FilexProductsService, useClass: MockFilexProductsService }],
    });

    service = TestBed.inject(FilexSummaryWidgetService);
    filexProductsService = TestBed.inject(FilexProductsService) as unknown as MockFilexProductsService;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    jest.clearAllMocks();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProductsType', () => {
    test('should call refreshProductsSumary and return getProductsSummary observable', (done) => {
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

      filexProductsService.getProductsSummary = of(mockSummary);

      service.getProductsType().subscribe((summary) => {
        expect(filexProductsService.refreshProductsSumary).toHaveBeenCalled();
        expect(summary).toEqual(mockSummary);
        done();
      });
    });
  });

  describe('getProducts', () => {
    test('should throw an error as it is not implemented', () => {
      expect(() => service.getProducts()).toThrow('method will implemented');
    });
  });
});
