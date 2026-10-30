import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { BcDialogService } from '@bancolombia/design-system-web/bc-services';

import { randAbn, randCompanyName } from '@ngneat/falso';
import { UserDataUseCase } from '@svn/auth-lib';
import { PdfUtilsService } from '@svn/shared-utils-web';
import { PDF_NAME_TO_EXPORT, TITLE_PRODUCTS_SUMMARY_FILEX_PDF } from '../../utils/constant/pdf-template-constants';
import { AlertService } from '../../utils/services/alert.service';
import { PdfService } from './pdf.service';

const bcDialogServiceMock = { open: jest.fn() };

const MAPPER_PRODUCTS = {
  status: { code: 200, msg: 'Operación exitosa' },
  response: {
    products: {
      arrProducts: [
        {
          id: 1,
          nameCategory: 'Cuentas depósito',
          iconCategory: 'capital',
          dataProducts: [[Object]],
          columns: [[Object], [Object], [Object], [Object]],
          tooltip: '',
          productId: 'DEPOSITS',
        },
        {
          id: 2,
          nameCategory: 'Tarjetas de crédito',
          iconCategory: 'cards',
          dataProducts: [[Object]],
          columns: [[Object], [Object], [Object], [Object]],
          tooltip: '',
          productId: 'CARDS',
        },
        {
          id: 3,
          nameCategory: 'Créditos',
          iconCategory: 'cash-payment',
          dataProducts: [[Object]],
          columns: [[Object], [Object], [Object], [Object]],
          tooltip: '',
          productId: 'LOANS',
        },
        {
          id: 4,
          nameCategory: 'Inversiones',
          iconCategory: 'stock-exchange',
          dataProducts: [[Object]],
          columns: [[Object], [Object], [Object], [Object]],
          tooltip: '',
          productId: 'INVESTMENTS',
        },
        {
          id: 5,
          nameCategory: 'Fondos de inversión colectiva - FIC',
          iconCategory: 'add-money',
          dataProducts: [[Object]],
          columns: [[Object], [Object], [Object], [Object]],
          tooltip:
            'Si tienes FIC activos en Fiduciaria y Valores, tus saldos se muestran consolidados, de lo contrario solo se visualiza el saldo de tus FIC Fiduciaria.',
          productId: 'FIDUCIARIES',
        },
      ],
    },
  },
};

const userMock = {
  companyName: randCompanyName(),
  documentType: 'CC',
  companyId: randAbn(),
};

const userDataUseCaseMock = {
  getUserData: jest.fn().mockReturnValue(userMock),
};

const pdfUtilsServiceMock = {
  drawPDFHeader: jest.fn(),
  drawPDFSubTitle: jest.fn(),
  drawPDFInfo: jest.fn(),
  drawPDFTable: jest.fn(),
  drawPDFProductCategories: jest.fn(),
  drawPDFFooter: jest.fn(),
  downloadPDF: jest.fn(),
};

pdfUtilsServiceMock.drawPDFHeader.mockReturnValue(pdfUtilsServiceMock);
pdfUtilsServiceMock.drawPDFSubTitle.mockReturnValue(pdfUtilsServiceMock);
pdfUtilsServiceMock.drawPDFInfo.mockReturnValue(pdfUtilsServiceMock);
pdfUtilsServiceMock.drawPDFTable.mockReturnValue(pdfUtilsServiceMock);
pdfUtilsServiceMock.drawPDFProductCategories.mockReturnValue(pdfUtilsServiceMock);
pdfUtilsServiceMock.drawPDFFooter.mockReturnValue(pdfUtilsServiceMock);
pdfUtilsServiceMock.downloadPDF.mockReturnValue(Promise.resolve());

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { provide: BcDialogService, useValue: bcDialogServiceMock },
        {
          provide: UserDataUseCase,
          useValue: userDataUseCaseMock,
        },
        AlertService,
        {
          provide: PdfUtilsService,
          useValue: pdfUtilsServiceMock,
        },
      ],
    });
    service = TestBed.inject(PdfService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('Should be call function downloadBalancesFilexPDF()', async () => {
    const userData = {
      user: userMock.companyName,
      [userMock.documentType]: userMock.companyId,
    };
    await service.downloadBalancesFilexPDF(MAPPER_PRODUCTS);
    expect(pdfUtilsServiceMock.drawPDFHeader).toHaveBeenCalled();
    expect(pdfUtilsServiceMock.drawPDFSubTitle).toHaveBeenCalledWith(TITLE_PRODUCTS_SUMMARY_FILEX_PDF);
    expect(pdfUtilsServiceMock.drawPDFInfo).toHaveBeenCalledWith(userData);
    expect(pdfUtilsServiceMock.drawPDFFooter).toHaveBeenCalled();
    expect(pdfUtilsServiceMock.drawPDFProductCategories).toHaveBeenCalled();
    expect(pdfUtilsServiceMock.downloadPDF).toHaveBeenCalledWith(PDF_NAME_TO_EXPORT);
  });
});
