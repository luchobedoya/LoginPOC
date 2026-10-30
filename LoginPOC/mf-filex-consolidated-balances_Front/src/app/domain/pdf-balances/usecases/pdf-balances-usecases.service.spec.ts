import { TestBed } from '@angular/core/testing';

import { HttpStatusCode } from '@angular/common/http';
import { IConsolidatedBalancesResponse } from '@bancolombia/consolidated-balances-widget-web';
import { PdfBalancesGateway } from '../models/pdf-balances-gateway';
import { PdfBalancesUsecasesService } from './pdf-balances-usecases.service';

describe('PdfBalancesUsecasesService', () => {
  let service: PdfBalancesUsecasesService;

  const mockPdfBalancesGateway = {
    downloadBalancesFilexPDF: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PdfBalancesGateway,
          useValue: mockPdfBalancesGateway,
        },
      ],
    });
    service = TestBed.inject(PdfBalancesUsecasesService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should be call function downloadBalancesFilexPDF()', () => {
    const mockData = {
      status: { code: HttpStatusCode.Ok, msg: 'Success' },
      response: { products: [] },
    } as IConsolidatedBalancesResponse;
    service.downloadBalancesFilexPDF(mockData);

    expect(mockPdfBalancesGateway.downloadBalancesFilexPDF).toHaveBeenCalledWith(mockData);
  });
});
