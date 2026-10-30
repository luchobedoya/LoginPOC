import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  ConsolidatedBalancesWidgetComponent,
  IConsolidatedBalancesResponse,
} from '@bancolombia/consolidated-balances-widget-web';
import { ContactListComponent, ONE, SVNComponentsModule, TWO, ZERO } from '@svn/shared-utils-web';
import { MockComponents, MockModule } from 'ng-mocks';
import { of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ACTIONS, LOCATION, TaggingElement } from '../../../../core/utils/constants/tagging-constants';
import { EnumMonitoring } from '../../../../domain/monitoring/models/monitoring.enum';
import { MonitoringUseCaseService } from '../../../../domain/monitoring/usecases/monitoring.usecase.service';
import { ProductsSummyFilexUsecasesService } from '../../../../domain/products-summy-filex/usecases/products-summy-filex-usecases.service';
import { SetTaggingUseCase } from '../../../../domain/tagging/usecases/set-tagging.usecase';
import { CREDIT_ROUTE, DEPOSIT_ROUTE, HOME_ROUTE, INVESTMENT_ROUTE } from '../../utils/constants/routes-constants';
import { FilexBalancesComponent } from './filex-balances.component';

const mockResponse: IConsolidatedBalancesResponse = {
  status: { code: 200, msg: 'successful' },
  response: {
    products: {},
  },
};

describe('FilexBalancesComponent', () => {
  let component: FilexBalancesComponent;
  let fixture: ComponentFixture<FilexBalancesComponent>;
  let mockRouter: Router;
  let mockProductsSummyFilexUseCase: ProductsSummyFilexUsecasesService;
  let mockChangeDetectorRef: ChangeDetectorRef;

  const MonitoringUseCaseServiceMock = {
    sendMonitoring: jest.fn(),
  };
  const setTaggingUseCaseMock = {
    invoke: jest.fn(),
  };

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() } as unknown as Router;
    mockProductsSummyFilexUseCase = {
      getProductsSummary: jest.fn().mockReturnValue(of(mockResponse)),
    } as unknown as ProductsSummyFilexUsecasesService;
    mockChangeDetectorRef = { detectChanges: jest.fn() } as unknown as ChangeDetectorRef;

    await TestBed.configureTestingModule({
      imports: [
        FilexBalancesComponent,
        MockComponents(ConsolidatedBalancesWidgetComponent, ContactListComponent),
        MockModule(SVNComponentsModule),
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ProductsSummyFilexUsecasesService, useValue: mockProductsSummyFilexUseCase },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
        {
          provide: MonitoringUseCaseService,
          useValue: MonitoringUseCaseServiceMock,
        },
        { provide: SetTaggingUseCase, useValue: setTaggingUseCaseMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilexBalancesComponent);
    component = fixture.componentInstance;
    jest.spyOn(document, 'querySelectorAll').mockClear();
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('reInit', () => {
    test('should reinitialize the widget', () => {
      component.reInit();

      expect(component.showWidgetConsolidatedBalances).toBe(true);
      expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalledTimes(ZERO);
      expect(component.showWidgetConsolidatedBalances).toBe(true);
    });
  });
  describe('onRetry', () => {
    test('should increment errorsCounter and reinitialize the widget', () => {
      const reInitSpy = jest.spyOn(component, 'reInit');
      expect(component.errorsCounter).toBe(ZERO);
      component.onRetry();
      expect(component.errorsCounter).toBe(ONE);
      expect(reInitSpy).toHaveBeenCalled();
    });
  });

  describe('mapperError', () => {
    test('should map specific errors to error components ', () => {
      const mockErrorResponse: IConsolidatedBalancesResponse = {
        status: { code: 500, msg: 'Internal Server Error' },
        response: {
          products: {},
        },
      };
      const result = component['mapperError'](mockErrorResponse);

      expect(result.errorCode).toBe(environment.genericError.toString());
      expect(component.showWidgetConsolidatedBalances).toBe(false);
    });

    test('should return generic error if status is not handled', () => {
      const mockErrorResponse: IConsolidatedBalancesResponse = {
        status: { code: 500, msg: 'Internal Server Error' },
        response: {
          products: {},
        },
      };
      const result = component['mapperError'](mockErrorResponse);

      expect(result.errorCode).toBe(environment.genericError.toString());
    });
  });

  describe('ngOnInit', () => {
    test('should subscribe to product summary and handle response', () => {
      jest.spyOn(mockProductsSummyFilexUseCase, 'getProductsSummary').mockReturnValue(of(mockResponse));
      component.ngOnInit();

      expect(mockProductsSummyFilexUseCase.getProductsSummary).toHaveBeenCalled();
      expect(component.currentProductSummary).toBe(mockResponse);
      expect(component.errorsCounter).toBe(ZERO);
      expect(MonitoringUseCaseServiceMock.sendMonitoring).toHaveBeenCalledWith(
        EnumMonitoring.REGISTRO_CONSULTA_CONSOLIDADO
      );
    });

    test('should handle error response correctly', () => {
      const mockErrorResponse: IConsolidatedBalancesResponse = {
        status: { code: 400, msg: 'Not Found' },
        response: {
          products: {},
        },
      };
      jest.spyOn(mockProductsSummyFilexUseCase, 'getProductsSummary').mockReturnValue(of(mockErrorResponse));

      component.ngOnInit();

      expect(component.currentProductSummary).toBe(mockErrorResponse);
      expect(component.errorComponent.errorCode).toBe(environment.genericError.toString());
      expect(component.errorsCounter).toBe(ZERO);
      expect(MonitoringUseCaseServiceMock.sendMonitoring).toHaveBeenCalledWith(EnumMonitoring.ERROR_APP);
    });
  });

  describe('getConsolidatedBalancesWidget', () => {
    test('should initialize configWidget with default values', () => {
      component['getConsolidatedBalancesWidget']();

      expect(component.configWidget).toBeDefined();
      expect(component.configWidget.searchConfig).toBeDefined();
      expect(component.configWidget.errorTemplates).toBeDefined();
      expect(component.configWidget.listConfig).toBeDefined();
    });
  });

  describe('mapperError for codes', () => {
    test('should handle specific error codes correctly', () => {
      const mockErrorResponse: IConsolidatedBalancesResponse = {
        status: { code: 400, msg: 'Error - SST0004' },
        response: {
          products: {},
        },
      };
      const result = component['mapperError'](mockErrorResponse);

      expect(result.errorCode).toBe(environment.genericError.toString());
      expect(component.showWidgetConsolidatedBalances).toBe(false);
    });

    test('should handle another error code', () => {
      const mockErrorResponse: IConsolidatedBalancesResponse = {
        status: { code: 400, msg: 'Error - 103' },
        response: {
          products: {},
        },
      };
      const result = component['mapperError'](mockErrorResponse);

      expect(result.errorCode).toBe(environment.genericError.toString());
      expect(component.showWidgetConsolidatedBalances).toBe(false);
    });

    test('should return default error for unhandled cases', () => {
      const mockErrorResponse: IConsolidatedBalancesResponse = {
        status: { code: 500, msg: 'Some unknown error' },
        response: {
          products: {},
        },
      };
      const result = component['mapperError'](mockErrorResponse);

      expect(result.errorCode).toBe(environment.genericError.toString());
      expect(component.showWidgetConsolidatedBalances).toBe(false);
    });
    test('should handle errors in products summary', () => {
      const mockErrorResponse: IConsolidatedBalancesResponse = {
        status: { code: 500, msg: 'Error' },
        response: {
          products: {},
        },
      };
      jest.spyOn(mockProductsSummyFilexUseCase, 'getProductsSummary').mockReturnValue(of(mockErrorResponse));

      component.ngOnInit();

      expect(component.currentProductSummary).toBe(mockErrorResponse);
    });
  });

  test('getCoachMarkConfig should return the correct configuration object', () => {
    const expectedConfig = {
      componentId: 'bc-item-1',
      templateCoachMark: null,
      show: false,
      steps: [],
    };
    const config = component.getCoachMarkConfig();
    expect(config).toEqual(expectedConfig);
  });
  test('getListConfig should return the correct configuration object', () => {
    const expectedConfig = {
      showIconMainColumn: false,
      showDropdownList: false,
      optionSelectedAction: expect.any(Function),
      dropdownOptions: [
        {
          id: 'descargas',
          icon: 'document-search',
          text: 'descargaropcion',
        },
        {
          id: 'cambiarPagina',
          icon: 'download-document',
          text: 'opcion personalizada',
        },
      ],
      groupLabels: false,
      alignData: 'right',
      clickListAction: expect.any(Function),
    };
    const config = component['getListConfig']();
    expect(config).toEqual(expectedConfig);
  });

  test('getDetailPageConfig should return the correct configuration object', () => {
    const expectedConfig = {
      buttonGroupFilter: {
        show: false,
        customClick: false,
        clickButton: expect.any(Function),
        items: [
          {
            id: '',
            filterField: '',
            label: '',
            value: '',
          },
        ],
        filterItems: false,
      },
      configTab: {
        show: false,
      },
      buttonDownload: {
        show: false,
        label: 'Descargar',
      },
    };
    const config = component.getDetailPageConfig();
    expect(config).toEqual(expectedConfig);
  });

  test('reInit should toggle showWidgetConsolidatedBalances and call detectChanges', () => {
    const detectChangesSpy = jest.spyOn(component['pChangeDetector'], 'detectChanges');

    component.showWidgetConsolidatedBalances = true;
    component.reInit();

    expect(detectChangesSpy).toHaveBeenCalled();
    expect(component.showWidgetConsolidatedBalances).toBe(true);
  });

  test('modifiedWidget should call separateLinesProducts', () => {
    const separateLinesProductsSpy = jest.spyOn(component, 'separateLinesProducts');

    component.modifiedWidget();

    expect(separateLinesProductsSpy).toHaveBeenCalled();
  });
  test('getAllClassProductList should return elements with class .product-list', () => {
    document.body.innerHTML = '<div class="product-list"></div><div class="product-list"></div>';
    const elements = component.getAllClassProductList();
    expect(elements).toHaveLength(TWO);
  });

  describe('getSummaryProducts', () => {
    test('should handle successful response', () => {
      const mockResponse: IConsolidatedBalancesResponse = {
        status: { code: HttpStatusCode.Ok, msg: 'Success' },
        response: { products: {} },
      };
      jest.spyOn(mockProductsSummyFilexUseCase, 'getProductsSummary').mockReturnValue(of(mockResponse));
      component.getSummaryProducts();
      expect(component.errorsCounter).toBe(ZERO);
      expect(component.currentProductSummary).toBe(mockResponse);
      expect(MonitoringUseCaseServiceMock.sendMonitoring).toHaveBeenCalledWith(
        EnumMonitoring.REGISTRO_CONSULTA_CONSOLIDADO
      );
    });

    test('should handle error response', () => {
      const mockErrorResponse: IConsolidatedBalancesResponse = {
        status: { code: HttpStatusCode.BadRequest, msg: 'Error' },
        response: { products: {} },
      };
      jest.spyOn(mockProductsSummyFilexUseCase, 'getProductsSummary').mockReturnValue(of(mockErrorResponse));
      const spyMapperError = jest.spyOn(component as any, 'mapperError');
      component.getSummaryProducts();
      expect(spyMapperError).toHaveBeenCalledWith(mockErrorResponse);
      expect(MonitoringUseCaseServiceMock.sendMonitoring).toHaveBeenCalledWith(EnumMonitoring.ERROR_APP);
    });
  });

  describe('goToHome', () => {
    test('should navigate to HOME_ROUTE and invoke tagging', () => {
      component.goToHome();

      expect(mockRouter.navigate).toHaveBeenCalledWith([HOME_ROUTE], {
        state: { source: 'mf-filex-consolidated-balances' },
      });
      expect(setTaggingUseCaseMock.invoke).toHaveBeenCalledWith('SEND_BUTTON', {
        element: 'ir a inicio',
        ubicacion: 'consolidados por productos',
      });
    });
  });

  describe('ngAfterViewChecked', () => {
    test('should call modifiedWidget if checkWidget is true', () => {
      jest.spyOn(component, 'modifiedWidget');
      component.checkWidget = true;

      component.ngAfterViewChecked();
      expect(component.modifiedWidget).toHaveBeenCalledTimes(ONE);
    });

    test('should not call modifiedWidget if checkWidget is false', () => {
      jest.spyOn(component, 'modifiedWidget');
      component.checkWidget = false;
      component.ngAfterViewChecked();
      expect(component.modifiedWidget).not.toHaveBeenCalled();
    });

    test('should update configWidget.errorTemplates with emptyError and errorTemplate', () => {
      component.ngAfterViewChecked();
      expect(component.configWidget.errorTemplates.emptyError).toBe(component.emptyError);
      expect(component.configWidget.errorTemplates.generalError).toBe(component.errorTemplate);
    });
  });

  describe('separateLinesProducts', () => {
    test('should do nothing if document.querySelectorAll returns an empty NodeList', () => {
      // Simulamos que `querySelectorAll` devuelve un NodeList vacío
      const emptyNodeList = [] as unknown as NodeListOf<Element>;
      jest.spyOn(document, 'querySelectorAll').mockReturnValue(emptyNodeList);

      component.separateLinesProducts();

      // Aseguramos que querySelectorAll fue llamado
      expect(document.querySelectorAll).toHaveBeenCalledWith('.product-list');
    });

    test('should add class "bc-mb-3" to each element in the NodeList', () => {
      // Mockeamos elementos con comportamiento de `classList`
      const mockElement1 = { classList: { add: jest.fn() } } as unknown as Element;
      const mockElement2 = { classList: { add: jest.fn() } } as unknown as Element;

      // Simulamos un NodeListOf<Element> con estos elementos
      const mockNodeList = [mockElement1, mockElement2] as unknown as NodeListOf<Element>;
      jest.spyOn(document, 'querySelectorAll').mockReturnValue(mockNodeList);

      component.separateLinesProducts();

      // Verificamos que `classList.add` fue llamado para cada elemento
      expect(mockElement1.classList.add).toHaveBeenCalledWith('bc-mb-3');
      expect(mockElement2.classList.add).toHaveBeenCalledWith('bc-mb-3');
    });
  });

  describe('getDropdownNative and getDropdownIconNative', () => {
    test('getDropdownNative should return NodeListOf<Element> containing elements with class "bc-dropdown"', () => {
      const mockElement1 = { id: 'dropdown1' } as unknown as Element;
      const mockElement2 = { id: 'dropdown2' } as unknown as Element;

      const mockNodeList = [mockElement1, mockElement2] as unknown as NodeListOf<Element>;
      jest.spyOn(document, 'querySelectorAll').mockReturnValue(mockNodeList);
      const result = component.getDropdownNative();
      expect(document.querySelectorAll).toHaveBeenCalledWith('.bc-dropdown');
      expect(result).toEqual(mockNodeList);
    });

    test('getDropdownNative should return an empty NodeListOf<Element> if no elements match', () => {
      const emptyNodeList = [] as unknown as NodeListOf<Element>;
      jest.spyOn(document, 'querySelectorAll').mockReturnValue(emptyNodeList);

      const result = component.getDropdownNative();

      expect(result).toEqual(emptyNodeList);
    });

    test('getDropdownIconNative should return NodeListOf<Element> containing elements with class "dropdown-icon"', () => {
      const mockElement1 = { id: 'icon1' } as unknown as Element;
      const mockElement2 = { id: 'icon2' } as unknown as Element;

      const mockNodeList = [mockElement1, mockElement2] as unknown as NodeListOf<Element>;
      jest.spyOn(document, 'querySelectorAll').mockReturnValue(mockNodeList);

      const result = component.getDropdownIconNative();

      expect(document.querySelectorAll).toHaveBeenCalledWith('.dropdown-icon');
      expect(result).toEqual(mockNodeList);
    });

    test('getDropdownIconNative should return an empty NodeListOf<Element> if no elements match', () => {
      const emptyNodeList = [] as unknown as NodeListOf<Element>;
      jest.spyOn(document, 'querySelectorAll').mockReturnValue(emptyNodeList);

      const result = component.getDropdownIconNative();
      expect(result).toEqual(emptyNodeList);
    });
  });

  describe('redirectSaldos', () => {
    test('should call redirect with DEPOSIT_ROUTE when product is "DEPOSITS"', () => {
      const product = 'DEPOSITS';
      const typeBalance = 'cuentas en dolares';
      jest.spyOn(component, 'redirect');
      component.redirectSaldos(typeBalance, product);

      expect(component.redirect).toHaveBeenCalledWith(DEPOSIT_ROUTE);
      expect(component.redirect).toHaveBeenCalledTimes(ONE);
    });

    test('should call redirect with CREDIT_ROUTE when product is "LOANS"', () => {
      const product = 'LOANS';
      const typeBalance = 'creditos en euros';
      jest.spyOn(component, 'redirect');
      component.redirectSaldos(typeBalance, product);

      expect(component.redirect).toHaveBeenCalledWith(CREDIT_ROUTE);
      expect(component.redirect).toHaveBeenCalledTimes(ONE);
    });

    test('should call redirect with INVESTMENT_ROUTE when product is "INVESTMENTS"', () => {
      const product = 'INVESTMENTS';
      const typeBalance = 'inversiones en euros';
      jest.spyOn(component, 'redirect');
      component.redirectSaldos(typeBalance, product);

      expect(component.redirect).toHaveBeenCalledWith(INVESTMENT_ROUTE);
      expect(component.redirect).toHaveBeenCalledTimes(ONE);
    });

    test('should not call redirect for an unknown product', () => {
      const product = 'UNKNOWN';
      const typeBalance = '';
      jest.spyOn(component, 'redirect');
      component.redirectSaldos(typeBalance, product);

      expect(component.redirect).not.toHaveBeenCalled();
    });
  });

  describe('normalizeText', () => {
    test('should lowercase and strip accents', () => {
      const input = 'ÁéÍ óÚ ÜçÑ';
      const expected = 'aei ou ucn';
      expect(component.normalizeText(input)).toBe(expected);
    });
  });

  describe('redirectSaldos tagging branches', () => {
    let invokeSpy: jest.SpyInstance;

    beforeEach(() => {
      invokeSpy = jest.spyOn(setTaggingUseCaseMock, 'invoke').mockClear();
    });

    test('DEPOSITS + dolar ➔ VIEW_DOLAR_DEPOSITS tag', () => {
      component.redirectSaldos(ACTIONS.VIEW_DOLAR_DEPOSITS, 'DEPOSITS');
      expect(invokeSpy).toHaveBeenCalledWith(TaggingElement.BUTTON, {
        element: ACTIONS.VIEW_DOLAR_DEPOSITS,
        ubicacion: LOCATION.CONSOLIDATED_BALANCES,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith([DEPOSIT_ROUTE], {
        state: { source: 'mf-filex-consolidated-balances' },
      });
    });

    test('DEPOSITS + cualquier otro ➔ VIEW_EUROS_DEPOSITS tag', () => {
      component.redirectSaldos('otra moneda', 'DEPOSITS');
      expect(invokeSpy).toHaveBeenCalledWith(TaggingElement.BUTTON, {
        element: ACTIONS.VIEW_EUROS_DEPOSITS,
        ubicacion: LOCATION.CONSOLIDATED_BALANCES,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith([DEPOSIT_ROUTE], {
        state: { source: 'mf-filex-consolidated-balances' },
      });
    });

    test('LOANS + dolar ➔ VIEW_DOLAR_LOANS tag', () => {
      component.redirectSaldos(ACTIONS.VIEW_DOLAR_LOANS, 'LOANS');
      expect(invokeSpy).toHaveBeenCalledWith(TaggingElement.BUTTON, {
        element: ACTIONS.VIEW_DOLAR_LOANS,
        ubicacion: LOCATION.CONSOLIDATED_BALANCES,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith([CREDIT_ROUTE], {
        state: { source: 'mf-filex-consolidated-balances' },
      });
    });

    test('LOANS + cualquier otro ➔ VIEW_EUROS_LOANS tag', () => {
      component.redirectSaldos('otro saldo', 'LOANS');
      expect(invokeSpy).toHaveBeenCalledWith(TaggingElement.BUTTON, {
        element: ACTIONS.VIEW_EUROS_LOANS,
        ubicacion: LOCATION.CONSOLIDATED_BALANCES,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith([CREDIT_ROUTE], {
        state: { source: 'mf-filex-consolidated-balances' },
      });
    });

    test('INVESTMENTS + dolar ➔ VIEW_DOLAR_INVESTMENTS tag', () => {
      component.redirectSaldos(ACTIONS.VIEW_DOLAR_INVESTMENTS, 'INVESTMENTS');
      expect(invokeSpy).toHaveBeenCalledWith(TaggingElement.BUTTON, {
        element: ACTIONS.VIEW_DOLAR_INVESTMENTS,
        ubicacion: LOCATION.CONSOLIDATED_BALANCES,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith([INVESTMENT_ROUTE], {
        state: { source: 'mf-filex-consolidated-balances' },
      });
    });

    test('INVESTMENTS + cualquier otro ➔ VIEW_EUROS_INVESTMENTS tag', () => {
      component.redirectSaldos('inversiones euro', 'INVESTMENTS');
      expect(invokeSpy).toHaveBeenCalledWith(TaggingElement.BUTTON, {
        element: ACTIONS.VIEW_EUROS_INVESTMENTS,
        ubicacion: LOCATION.CONSOLIDATED_BALANCES,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith([INVESTMENT_ROUTE], {
        state: { source: 'mf-filex-consolidated-balances' },
      });
    });
  });
});
