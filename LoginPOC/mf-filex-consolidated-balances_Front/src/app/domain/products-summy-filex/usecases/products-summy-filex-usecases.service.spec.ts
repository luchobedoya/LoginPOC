import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { ProductsSummyFilexGateway } from '../models/gateways/products-summy-filex-gateway';
import { ProductsSummyFilexUsecasesService } from './products-summy-filex-usecases.service';

class MockProductsSummyFilexGateway extends ProductsSummyFilexGateway {
  private _productsSummary$ = of({});

  get getProductsSummary(): Observable<any> {
    return this._productsSummary$;
  }

  refreshProductsSumary = jest.fn();
  clearProductsSummary = jest.fn();
}

describe('ProductsSummyFilexUsecasesService', () => {
  let service: ProductsSummyFilexUsecasesService;
  let gateway: MockProductsSummyFilexGateway;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsSummyFilexUsecasesService,
        { provide: ProductsSummyFilexGateway, useClass: MockProductsSummyFilexGateway },
      ],
    });
    service = TestBed.inject(ProductsSummyFilexUsecasesService);
    gateway = TestBed.inject(ProductsSummyFilexGateway) as unknown as MockProductsSummyFilexGateway;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProductsSummary', () => {
    test('should handle error from gateway when getProductsSummary fails', (done) => {
      const mockError = new Error('Test error');
      jest.spyOn(gateway, 'getProductsSummary', 'get').mockReturnValue(throwError(() => mockError));
      let bandera = false;
      service.getProductsSummary().subscribe({
        next: () => {
          bandera = true;
        },
        error: (error) => {
          expect(error).toBe(mockError);
          expect(bandera).toBe(false);
          done();
        },
      });
    });
  });

  describe('refreshProductsSumary', () => {
    test('should call refreshProductsSumary on gateway', () => {
      service.refreshProductsSumary();
      expect(gateway.refreshProductsSumary).toHaveBeenCalled();
    });

    test('should call refreshProductsSumary once on gateway when called multiple times', () => {
      service.refreshProductsSumary();
      service.refreshProductsSumary();
      service.refreshProductsSumary();

      const expectedTimes = 3;
      expect(gateway.refreshProductsSumary).toHaveBeenCalledTimes(expectedTimes);
    });
  });

  describe('clearProductsSummary', () => {
    test('should call clearProductsSummary on gateway', () => {
      service.clearProductsSummary();
      expect(gateway.clearProductsSummary).toHaveBeenCalled();
    });

    test('should call clearProductsSummary once when called multiple times', () => {
      service.clearProductsSummary();
      service.clearProductsSummary();
      service.clearProductsSummary();

      const expectedTimes = 3;
      expect(gateway.clearProductsSummary).toHaveBeenCalledTimes(expectedTimes);
    });
  });
});
