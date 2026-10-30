import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import {
  ConsolidatedBalancesWidgetComponent,
  IConsolidatedBalancesResponse,
} from '@bancolombia/consolidated-balances-widget-web';
import { BcBreadcrumbV2Component } from '@bancolombia/design-system-web/bc-breadcrumb-v2';
import { BcCircleLoadingComponent } from '@bancolombia/design-system-web/bc-circle-loading';
import { BcIconButtonComponent } from '@bancolombia/design-system-web/bc-icon-button';
import { BcTabsGroupComponent } from '@bancolombia/design-system-web/bc-tabs-group';
import { BcTagComponent } from '@bancolombia/design-system-web/bc-tag';
import { ContactListComponent, IErrorRetry, ONE, ZERO } from '@svn/shared-utils-web';
import { MockComponents } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ACTIONS, LOCATION } from '../../../../core/utils/constants/tagging-constants';
import { PdfBalancesUsecasesService } from '../../../../domain/pdf-balances/usecases/pdf-balances-usecases.service';
import { ProductsSummyFilexUsecasesService } from '../../../../domain/products-summy-filex/usecases/products-summy-filex-usecases.service';
import { SetTaggingUseCase } from '../../../../domain/tagging/usecases/set-tagging.usecase';
import { DataTransformService } from '../../../../infrastructure/driven-adapters/filex-product/data-transform.service';
import { FilexBalancesComponent } from '../../components/filex-balances/filex-balances.component';
import { MAXIMUM_RETRIES_ERROR_FILEX } from '../../utils/constants/error-constants';
import { HOME_ROUTE } from '../../utils/constants/routes-constants';
import { FilexSummaryBalancesComponent } from './filex-summary-balances.component';

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

describe('FilexSummaryBalancesComponent', () => {
  let component: FilexSummaryBalancesComponent;
  let fixture: ComponentFixture<FilexSummaryBalancesComponent>;
  let tabsGroupComponent: jest.Mocked<BcTabsGroupComponent>;
  let router: Router;
  const zero = 0;
  const pdfBalancesUseCaseMock = {
    downloadBalancesPDF: jest.fn(),
    downloadBalancesFilexPDF: jest.fn(),
  };
  const productsSummyFilexUseCaseMock = {
    getProductsSummary: jest.fn().mockReturnValue(of()),
    refreshProductsSumary: jest.fn(),
    clearProductsSummary: jest.fn(),
  };
  const DataTransformServiceMock = {
    mapResponseData: jest.fn(),
    isValidResponse: jest.fn(),
    mapStatus: jest.fn(),
    mapProducts: jest.fn(),
    mapProductData: jest.fn(),
    generateId: jest.fn(),
    mapDataProducts: jest.fn(),
    getModifiedColumns: jest.fn(),
    getColumns: jest.fn(),
    getColumnLabel: jest.fn(),
    getColumnNameID: jest.fn(),
  };

  const tabsGroupComponentMock = {
    selectTab: jest.fn(),
    selectIndex: jest.fn(),
  };
  const SetTaggingUseCaseMock = {
    setTagging: jest.fn(),
    invoke: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilexSummaryBalancesComponent,
        MockComponents(
          BcTagComponent,
          BcIconButtonComponent,
          BcCircleLoadingComponent,
          ContactListComponent,
          BcBreadcrumbV2Component,
          BcTabsGroupComponent,
          BcIconButtonComponent,
          FilexBalancesComponent,
          ConsolidatedBalancesWidgetComponent
        ),
      ],
      providers: [
        provideRouter([]),
        {
          provide: ProductsSummyFilexUsecasesService,
          useValue: productsSummyFilexUseCaseMock,
        },
        { provide: DataTransformService, useValue: DataTransformServiceMock },
        { provide: SetTaggingUseCase, useValue: SetTaggingUseCaseMock },
        {
          provide: PdfBalancesUsecasesService,
          useValue: pdfBalancesUseCaseMock,
        },
        {
          provide: DataTransformService,
          useValue: DataTransformServiceMock,
        },
        {
          provide: BcTabsGroupComponent,
          useValue: tabsGroupComponentMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilexSummaryBalancesComponent);
    component = fixture.componentInstance;
    tabsGroupComponent = TestBed.inject(BcTabsGroupComponent) as jest.Mocked<BcTabsGroupComponent>;
    component.tabsGroup = tabsGroupComponent;
    router = TestBed.inject(Router);
    router.navigateByUrl = jest.fn();
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Test method onInit', () => {
    test('should call clearProductsSummary on init', () => {
      const clearProductsSummarySpy = jest.spyOn(productsSummyFilexUseCaseMock, 'clearProductsSummary');
      component.ngOnInit();
      expect(clearProductsSummarySpy).toHaveBeenCalled();
    });
  });

  test('goToHome should navigate to HOME_ROUTE', () => {
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');
    const taggingButtonSpy = jest.spyOn(component, 'taggingButton');
    component.goToHome();
    expect(taggingButtonSpy).toHaveBeenCalledWith(ACTIONS.GO_TO_HOME);
    expect(navigateByUrlSpy).toHaveBeenCalledWith(HOME_ROUTE);
  });

  test('should retry fetching products on retry', () => {
    const taggingButtonSpy = jest.spyOn(component, 'taggingButton');
    const retryEvent = { actualRetry: 1, maximumRetriesRequest: 3 };

    component.onRetry(retryEvent);
    expect(taggingButtonSpy).toHaveBeenCalledWith(ACTIONS.TRY_AGAIN);
  });

  test('should navigate to home and invoke taggingButton in goToHome', () => {
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');
    const taggingButtonSpy = jest.spyOn(component, 'taggingButton');
    component.goToHome();
    expect(navigateSpy).toHaveBeenCalled();
    expect(taggingButtonSpy).toHaveBeenCalledWith(ACTIONS.GO_TO_HOME);
  });
  test('getProducts should call getProductsSummary and handle response', () => {
    const productsMock = [{ name: 'product1' }, { name: 'product2' }];
    jest.spyOn(productsSummyFilexUseCaseMock, 'getProductsSummary').mockReturnValue(of(productsMock));

    component.getProducts();

    expect(productsSummyFilexUseCaseMock.getProductsSummary).toHaveBeenCalled();
  });

  test('onRetry should correctly handle different retryEvent values', () => {
    const retryEvent = { actualRetry: 2, maximumRetriesRequest: 3 };
    const taggingButtonSpy = jest.spyOn(component, 'taggingButton');

    component.onRetry(retryEvent);
    expect(taggingButtonSpy).toHaveBeenCalledWith(ACTIONS.TRY_AGAIN);
  });

  test('should handle error correctly when getProductsSummary fails', () => {
    const mockErrorResponse = new HttpErrorResponse({
      error: 'Test error',
      status: 500,
    });

    productsSummyFilexUseCaseMock.getProductsSummary.mockReturnValue(throwError(() => mockErrorResponse));
    component.getProducts();

    expect(component.errorsCounter).toBe(zero);
    expect(component.errorComponent.errorCode).toBe(environment.genericError);
  });

  test('should handle successful response correctly when getProductsSummary is called', () => {
    const mockData: IConsolidatedBalancesResponse = {
      status: { code: HttpStatusCode.Ok, msg: 'Operación exitosa' },
      response: {
        products: {
          loans: [
            {
              USD: {
                currentCapital: 1.0,
                disbursementAmount: 20.0,
              },
            },
            {
              EUR: {
                currentCapital: 1.0,
                disbursementAmount: 12.0,
              },
            },
          ],
        },
      },
    };

    const mappedDataMock = {};

    productsSummyFilexUseCaseMock.getProductsSummary.mockReturnValue(of(mockData));
    DataTransformServiceMock.mapResponseData.mockReturnValue(mappedDataMock);

    component.getProducts();

    expect(component.currentProductSummary).toBe(mockData);
    expect(component.mappedData).toBe(mappedDataMock);
    expect(DataTransformServiceMock.mapResponseData).toHaveBeenCalledWith(mockData);
    expect(component.errorsCounter).toBe(zero);
  });

  test('should currentProductSummary  be undefine when status code isnt OK', () => {
    const mockData: IConsolidatedBalancesResponse = {
      status: { code: HttpStatusCode.NotFound, msg: 'not found' },
      response: {} as any,
    };
    productsSummyFilexUseCaseMock.getProductsSummary.mockReturnValue(of(mockData));
    component.getProducts();
    expect(component.currentProductSummary).toBeUndefined();
  });

  describe('getProducts', () => {
    test('should call showLoading', () => {
      const spyshowLoading = jest.spyOn(component.bcCircleLoading, 'showCircleLoading');
      component.getProducts();
      expect(spyshowLoading).toHaveBeenCalled();
    });
  });
  describe('refreshData', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      component.bcCircleLoading = {
        showCircleLoading: jest.fn(),
      } as any;

      component.balanceWidgetComponent = {
        reInit: jest.fn(),
        modifiedWidget: jest.fn(),
      } as any;
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should call reInit on balanceWidgetComponent', () => {
      component.refreshData();
      expect(component.balanceWidgetComponent.reInit).toHaveBeenCalled();
    });

    test('should call modifiedWidget on balanceWidgetComponent', () => {
      component.refreshData();
      expect(component.balanceWidgetComponent.modifiedWidget).toHaveBeenCalled();
    });

    test('should call taggingButton with the correct action', () => {
      const spytagingButton = jest.spyOn(component, 'taggingButton');
      component.refreshData();
      expect(spytagingButton).toHaveBeenCalledWith(ACTIONS.REFRESH);
    });
  });

  test('should call taggingButton in generateSummaryFilexPDF', () => {
    const taggingButtonSpy = jest.spyOn(component, 'taggingButton');
    component.generateSummaryFilexPDF();
    expect(taggingButtonSpy).toHaveBeenCalledWith(ACTIONS.DOWNLOAD_BALANCES, LOCATION.CONSOLIDATED_BALANCES);
    expect(taggingButtonSpy).toHaveBeenCalledWith(ACTIONS.DOWNLOAD_BALANCES, LOCATION.CONSOLIDATED_BALANCES);
  });

  test('should call getProducts on ngAfterViewInit', () => {
    const getProductsSpy = jest.spyOn(component, 'getProducts');
    component.ngAfterViewInit();
    expect(getProductsSpy).toHaveBeenCalled();
  });

  test('should invoke taggingButton with all parameters', () => {
    const spy = jest.spyOn(component['_setTaggingUseCase'], 'invoke');
    const number = 123;
    component.taggingButton('ACTION', 'LOCATION', number);
    expect(spy).toHaveBeenCalledWith('SEND_BUTTON', {
      element: 'ACTION',
      ubicacion: 'LOCATION',
      codigoError: 123,
    });
  });

  test('should invoke taggingButton with partial parameters', () => {
    const spy = jest.spyOn(component['_setTaggingUseCase'], 'invoke');
    component.taggingButton('ACTION');
    expect(spy).toHaveBeenCalledWith('SEND_BUTTON', { element: 'ACTION' });
  });

  test('should set mappedData on successful response', () => {
    productsSummyFilexUseCaseMock.getProductsSummary.mockReturnValue(of(MAPPER_PRODUCTS));

    component.getProducts();

    expect(component.currentProductSummary).toEqual(MAPPER_PRODUCTS);
    expect(component.mappedData).toBeDefined();
    expect(component.emptyErrorValue).toBe(false);
  });

  test('should handle error response and update errorComponent', () => {
    const mockError = new HttpErrorResponse({ status: 500 });
    productsSummyFilexUseCaseMock.getProductsSummary.mockReturnValue(throwError(() => mockError));

    component.getProducts();

    expect(component.errorConstant).toBe(true);
    expect(component.errorComponent.errorCode).toBe(environment.genericError);
  });

  test('should retry fetching products when actualRetry is less than maximumRetriesRequest', () => {
    const retryEvent: IErrorRetry = { actualRetry: 1, maximumRetriesRequest: 3 };
    const spy = jest.spyOn(component, 'getProducts');

    component.onRetry(retryEvent);

    expect(spy).toHaveBeenCalledWith(true);
    expect(component.errorsCounter).toBe(ONE);
  });

  test('should update errorComponent on maximum retries', () => {
    const retryEvent: IErrorRetry = { actualRetry: 3, maximumRetriesRequest: 3 };

    component.onRetry(retryEvent);

    expect(component.errorComponent).toEqual(MAXIMUM_RETRIES_ERROR_FILEX);
  });

  test('should navigate to /saldos-consolidados when positionTag is 0 and firstPageLoad is true', () => {
    const spy = jest.spyOn(router, 'navigate');
    component.firstPageLoad = true;
    component.changeTab(ZERO);
    expect(spy).toHaveBeenCalledWith(['/saldos-consolidados']);
  });

  test('should call downloadBalancesFilexPDF when mappedData is available', () => {
    component.mappedData = { someData: 'test' };
    const spy = jest.spyOn(pdfBalancesUseCaseMock, 'downloadBalancesFilexPDF');

    component.generateSummaryFilexPDF();

    expect(spy).toHaveBeenCalledWith(component.mappedData);
  });

  test('should show loader when onRetryComponent is executed', () => {
    const spy = jest.spyOn(component.bcCircleLoading, 'showCircleLoading');
    component.onRetryComponent();
    expect(spy).toHaveBeenCalled();
  });
});
