import { NgTemplateOutlet } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ConsolidatedBalancesWidgetComponent,
  IConfigConsolidatedBalancesWidget,
  IConsolidatedBalancesResponse,
} from '@bancolombia/consolidated-balances-widget-web';
import { ContactListComponent, ErrorComponent, IErrorComponent, ONE, ZERO } from '@svn/shared-utils-web';
import { filter, take } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { TaggableData } from '../../../../core/models/taggable-data.model';
import { ACTIONS, LOCATION, TaggingElement } from '../../../../core/utils/constants/tagging-constants';
import { EnumMonitoring } from '../../../../domain/monitoring/models/monitoring.enum';
import { MonitoringUseCaseService } from '../../../../domain/monitoring/usecases/monitoring.usecase.service';
import { ProductsSummyFilexUsecasesService } from '../../../../domain/products-summy-filex/usecases/products-summy-filex-usecases.service';
import { SetTaggingUseCase } from '../../../../domain/tagging/usecases/set-tagging.usecase';
import { errorEmpty } from '../../../../infrastructure/utils/constant/errorConstans';
import {
  emptyError,
  errorDefault,
  LABEL_CANTACT_US,
  MAXIMUM_RETRIES_ERROR_FILEX,
} from '../../utils/constants/error-constants';
import { CREDIT_ROUTE, DEPOSIT_ROUTE, HOME_ROUTE, INVESTMENT_ROUTE } from '../../utils/constants/routes-constants';

@Component({
  selector: 'svn-filex-balances',
  templateUrl: './filex-balances.component.html',
  styleUrls: ['./filex-balances.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet, ConsolidatedBalancesWidgetComponent, ErrorComponent, ContactListComponent],
})
export class FilexBalancesComponent implements OnInit, AfterViewChecked {
  public configWidget!: IConfigConsolidatedBalancesWidget;

  @ViewChild('errorTemplate') errorTemplate!: ElementRef<any>;
  @ViewChild('emptyError') emptyError!: ElementRef<any>;

  showWidgetConsolidatedBalances = true;
  checkWidget = true;
  genericError = environment.genericError;
  emptyErrorComponent: IErrorComponent = { ...emptyError, errorCode: errorEmpty.toString() };
  errorComponent: IErrorComponent = { ...errorDefault, errorCode: environment.genericError.toString() };
  errorContact: IErrorComponent = {
    ...MAXIMUM_RETRIES_ERROR_FILEX,
    btnText: LABEL_CANTACT_US,
    errorCode: environment.genericError.toString(),
  };
  errorsCounter = ZERO;
  currentProductSummary: IConsolidatedBalancesResponse | undefined = undefined;
  emtyErrorCode = 'SST0004';
  emptyErrorCodeOmologate = '103';
  private _monitoringUseCaseService = inject(MonitoringUseCaseService);
  private _setTaggingUseCase = inject(SetTaggingUseCase);
  codeProcess!: number;
  @Output() eventoOnRetry = new EventEmitter<void>();

  constructor(
    private pChangeDetector: ChangeDetectorRef,
    private router: Router,
    private _productsSummyFilexUseCase: ProductsSummyFilexUsecasesService
  ) {
    this.getConsolidatedBalancesWidget();
  }

  ngOnInit(): void {
    this.getSummaryProducts();
  }

  getSummaryProducts(): void {
    this._productsSummyFilexUseCase
      .getProductsSummary()
      .pipe(
        filter((data) => !!data),
        take(ONE)
      )
      .subscribe((data: IConsolidatedBalancesResponse) => {
        this.currentProductSummary = data;
        if (data?.status.code === HttpStatusCode.Ok) {
          this.errorsCounter = ZERO;
          this._monitoringUseCaseService.sendMonitoring(EnumMonitoring.REGISTRO_CONSULTA_CONSOLIDADO);
        } else {
          this.errorComponent = this.mapperError(data);
          this._monitoringUseCaseService.sendMonitoring(EnumMonitoring.ERROR_APP);
        }
      });
  }

  ngAfterViewChecked(): void {
    if (this.checkWidget) {
      this.modifiedWidget();
    }
    this.configWidget.errorTemplates.emptyError = this.emptyError;
    this.configWidget.errorTemplates.generalError = this.errorTemplate;
    this.pChangeDetector.detectChanges();
  }

  reInit(): void {
    this.showWidgetConsolidatedBalances = false;
    this.pChangeDetector.detectChanges();
    this.showWidgetConsolidatedBalances = true;
  }

  /**
   * Método que permite hacer el llamado al taggeo del boton
   * @memberof FilexSummaryBalancesComponent
   * @returns {void}
   */
  public setTaggingButton(action: string, location?: string, codigoError?: number, errorName?: string): void {
    const taggableData: TaggableData = {
      element: action,
      ...(location && { ubicacion: location }),
      ...(codigoError && { codigoError }),
      ...(errorName && { errorName }),
    };
    this._setTaggingUseCase.invoke(TaggingElement.BUTTON, taggableData);
  }
  onRetry() {
    this.errorsCounter++;
    this.eventoOnRetry.emit();
    this.reInit();
    this.setTaggingButton(ACTIONS.TRY_AGAIN, LOCATION.CONSOLIDATED_BALANCES, this.codeProcess);
  }

  goToHome() {
    this.redirect(HOME_ROUTE);
    this.setTaggingButton(ACTIONS.GO_TO_HOME, LOCATION.CONSOLIDATED_BALANCES);
  }

  redirect(route: string) {
    this.router.navigate([route], { state: { source: 'mf-filex-consolidated-balances' } });
  }

  private getConsolidatedBalancesWidget() {
    this.configWidget = {
      dataTableConfig: {
        id: 'filex-consolidated-balances',
        multicheck: false,
        paginationBackend: false,
        columnHeaders: {
          data: [],
        },
        header: {
          title: {
            text: '',
          },
        },
      },
      searchConfig: {
        templateSearch: null,
        templateSearchAdvanced: null,
      },
      errorTemplates: {
        emptyError: this.emptyError,
        generalError: this.errorTemplate,
      },
      listConfig: this.getListConfig(),
      startOnDetail: false,
      showListOnDetail: true,
      showProductsAsList: true,
      templateCategories: {},
      detailPage: this.getDetailPageConfig(),
      coachmark: this.getCoachMarkConfig(),
      canHideNoDataTemplate: true,
    };
  }
  getCoachMarkConfig() {
    return {
      componentId: 'bc-item-1',
      templateCoachMark: null,
      show: false,
      steps: [],
    };
  }
  getListConfig(): any {
    return {
      showIconMainColumn: false,
      showDropdownList: false,
      optionSelectedAction: () => {
        return null;
      },
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
      clickListAction: (value: any) => {
        this.redirectSaldos(value['1'], value.productId);
      },
    };
  }

  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  redirectSaldos(typeBalance: string, product: string) {
    const normalizedTypeBalance = this.normalizeText(typeBalance);
    switch (product) {
      case 'DEPOSITS':
        if (normalizedTypeBalance === ACTIONS.VIEW_DOLAR_DEPOSITS) {
          this.setTaggingButton(ACTIONS.VIEW_DOLAR_DEPOSITS, LOCATION.CONSOLIDATED_BALANCES);
        } else {
          this.setTaggingButton(ACTIONS.VIEW_EUROS_DEPOSITS, LOCATION.CONSOLIDATED_BALANCES);
        }
        this.redirect(DEPOSIT_ROUTE);
        break;
      case 'LOANS':
        if (normalizedTypeBalance === ACTIONS.VIEW_DOLAR_LOANS) {
          this.setTaggingButton(ACTIONS.VIEW_DOLAR_LOANS, LOCATION.CONSOLIDATED_BALANCES);
        } else {
          this.setTaggingButton(ACTIONS.VIEW_EUROS_LOANS, LOCATION.CONSOLIDATED_BALANCES);
        }
        this.redirect(CREDIT_ROUTE);
        break;
      case 'INVESTMENTS':
        if (normalizedTypeBalance === ACTIONS.VIEW_DOLAR_INVESTMENTS) {
          this.setTaggingButton(ACTIONS.VIEW_DOLAR_INVESTMENTS, LOCATION.CONSOLIDATED_BALANCES);
        } else {
          this.setTaggingButton(ACTIONS.VIEW_EUROS_INVESTMENTS, LOCATION.CONSOLIDATED_BALANCES);
        }
        this.redirect(INVESTMENT_ROUTE);
        break;
      default:
        break;
    }
  }
  getDetailPageConfig() {
    return {
      buttonGroupFilter: {
        show: false,
        customClick: false,
        clickButton: () => {
          return null;
        },
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
  }

  modifiedWidget() {
    this.checkWidget = true;
    this.separateLinesProducts();
  }

  getDropdownNative() {
    return document.querySelectorAll('.bc-dropdown');
  }

  getDropdownIconNative() {
    return document.querySelectorAll('.dropdown-icon');
  }

  separateLinesProducts() {
    const linesProducts = this.getAllClassProductList();
    if (linesProducts.length > ZERO) {
      linesProducts.forEach((element: HTMLElement | Element) => {
        if (element) {
          element.classList?.add('bc-mb-3');
        }
      });
    }
  }

  getAllClassProductList() {
    return document.querySelectorAll('.product-list');
  }
  private mapperError(response: IConsolidatedBalancesResponse): IErrorComponent {
    const status = response.status;
    let errorCode = status.code.toString();
    const codeError = status.msg.split(' - ', ONE);
    this.codeProcess = parseInt(codeError[0], 10);
    this.showWidgetConsolidatedBalances = false;
    const defaultError: IErrorComponent = JSON.parse(JSON.stringify(errorDefault));

    if (codeError.includes(this.emtyErrorCode) || codeError.includes(this.emptyErrorCodeOmologate)) {
      errorCode = errorEmpty.toString();
      this.errorComponent = { ...this.emptyErrorComponent, errorCode };
      return { ...this.errorComponent, errorCode: errorEmpty.toString() };
    }

    if (status.code && status.msg) {
      return { ...defaultError, errorCode: environment.genericError.toString() };
    }
    return { ...this.errorComponent };
  }
}
