import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IConsolidatedBalancesResponse } from '@bancolombia/consolidated-balances-widget-web';
import { BcBreadcrumbV2Component } from '@bancolombia/design-system-web/bc-breadcrumb-v2';
import { BcCircleLoadingComponent } from '@bancolombia/design-system-web/bc-circle-loading';
import { BcIconComponent } from '@bancolombia/design-system-web/bc-icon';
import { BcIconButtonComponent } from '@bancolombia/design-system-web/bc-icon-button';
import { BcTabsGroupComponent } from '@bancolombia/design-system-web/bc-tabs-group';
import { BcTagComponent } from '@bancolombia/design-system-web/bc-tag';
import { BcTooltipDirective } from '@bancolombia/design-system-web/bc-tooltip';
import { IErrorComponent, IErrorRetry, ONE, THREE, ZERO } from '@svn/shared-utils-web';
import { Observable, filter, finalize, take } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { TaggableData } from '../../../../core/models/taggable-data.model';
import { ACTIONS, ACTIONS_PATHS, LOCATION, TaggingElement } from '../../../../core/utils/constants/tagging-constants';
import { TITLE_LOADING } from '../../../../core/utils/constants/title-loading';
import { PdfBalancesUsecasesService } from '../../../../domain/pdf-balances/usecases/pdf-balances-usecases.service';
import { ProductsSummyFilexUsecasesService } from '../../../../domain/products-summy-filex/usecases/products-summy-filex-usecases.service';
import { SetTaggingUseCase } from '../../../../domain/tagging/usecases/set-tagging.usecase';
import { DataTransformService } from '../../../../infrastructure/driven-adapters/filex-product/data-transform.service';
import { errorEmpty } from '../../../../infrastructure/utils/constant/errorConstans';
import { FilexBalancesComponent } from '../../components/filex-balances/filex-balances.component';
import { MAXIMUM_RETRIES_ERROR_FILEX, emptyError, errorDefault } from '../../utils/constants/error-constants';
import { HOME_ROUTE } from '../../utils/constants/routes-constants';

@Component({
  selector: 'svn-filex-summary-balances',
  templateUrl: './filex-summary-balances.component.html',
  styleUrls: ['./filex-summary-balances.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    FilexBalancesComponent,
    BcBreadcrumbV2Component,
    BcTagComponent,
    BcIconButtonComponent,
    BcTooltipDirective,
    BcIconComponent,
    BcCircleLoadingComponent,
  ],
})
export class FilexSummaryBalancesComponent implements AfterViewInit, OnInit {
  @ViewChild(BcCircleLoadingComponent, { static: false }) bcCircleLoading!: BcCircleLoadingComponent;
  @ViewChild(FilexBalancesComponent) balanceWidgetComponent!: FilexBalancesComponent;
  @ViewChild('tabsGroup') tabsGroup!: BcTabsGroupComponent;
  selected!: string;
  mappedData: any;
  emptyErrorValue = false;
  errorConstant = false;
  currentProductSummary: IConsolidatedBalancesResponse | undefined = undefined;
  swEnable$!: Observable<boolean>;
  enableTagsInternational = false;

  /**
   * Contador de errores para reintento en interfaz de error
   *
   * @memberof FilexSummaryBalancesComponent
   */
  errorsCounter = ZERO;

  /**
   * Componente genérico que muestra el error en la interfaz
   *
   * @type {IErrorComponent}
   * @memberof FilexSummaryBalancesComponent
   */
  errorComponent: IErrorComponent = { ...errorDefault, errorCode: environment.genericError.toString() };

  /**
   * Componente genérico que muestra el error de sin productos en la interfaz
   *
   * @type {IErrorComponent}
   * @memberof FilexSummaryBalancesComponent
   */
  emptyErrorComponent: IErrorComponent = { ...emptyError, errorCode: errorEmpty.toString() };

  /**
   * Objeto contiene informacion de contacto para error svn
   * @type {IErrorComponent}
   * @memberof FilexSummaryBalancesComponent
   */
  errorContact: IErrorComponent = { ...MAXIMUM_RETRIES_ERROR_FILEX, errorCode: environment.genericError.toString() };

  private _setTaggingUseCase = inject(SetTaggingUseCase);
  public titleLoader = TITLE_LOADING.LOAD_BASIC;
  constructor(
    private router: Router,
    private _pdfBalancesUseCases: PdfBalancesUsecasesService,
    private _productsSummyFilexUseCase: ProductsSummyFilexUsecasesService,
    private dataTransformService: DataTransformService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._productsSummyFilexUseCase.clearProductsSummary();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.selectInternacionalTab();
    this.getProducts();
    this.customTagging(ACTIONS_PATHS.PATH_CONSOLIDATE_BALANCE, LOCATION.CONSOLIDATED_BALANCES);
  }

  public customTagging(path: string, location: string): void {
    const taggableData: TaggableData = {
      path: path,
      ubicacion: location,
    };

    this._setTaggingUseCase.invoke(TaggingElement.PAGEVIEW, taggableData);
  }
  /**
   * Método que permite hacer el llamado al taggeo del boton
   * @memberof FilexSummaryBalancesComponent
   * @returns {void}
   */
  public taggingButton(action: string, location?: string, codigoError?: number): void {
    const taggableData: TaggableData = {
      element: action,
      ...(location && { ubicacion: location }),
      ...(codigoError && { codigoError }),
    };
    this._setTaggingUseCase.invoke(TaggingElement.BUTTON, taggableData);
  }

  breadcrumbItems = [
    { name: 'Inicio', url: HOME_ROUTE },
    { name: 'Saldos consolidados - Consolidados por producto', url: '' },
  ];
  refreshData(): void {
    this.balanceWidgetComponent.reInit();
    this.balanceWidgetComponent.modifiedWidget(); //borrar esta linea para habilitar el boton.
    this.getProducts(true);
    this.taggingButton(ACTIONS.REFRESH);
  }

  /**
   * Funcion que obtiene un resumen de productos
   * @returns {void} Un observable con la información de los productos.
   */
  getProducts(isRetry?: boolean): void {
    this.bcCircleLoading.showCircleLoading();
    this.cdr.detectChanges();
    this._productsSummyFilexUseCase
      .getProductsSummary()
      .pipe(
        filter((data) => !!data),
        take(ONE),
        finalize(() => {
          this.bcCircleLoading.hideCircleLoading();
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data: IConsolidatedBalancesResponse) => {
          if (data && data.status.code === HttpStatusCode.Ok) {
            this.currentProductSummary = data;
            this.mappedData = this.dataTransformService.mapResponseData(data);
            this.emptyErrorValue = false;
          } else {
            this.currentProductSummary = undefined;
          }
        },
        error: (error: HttpErrorResponse | any) => {
          this.currentProductSummary = undefined;
          const errorCode = error.code ? error.code : environment.genericError;
          this.errorConstant = true;

          if (isRetry) {
            this.errorsCounter++;
          }
          this.errorComponent = { ...this.emptyErrorComponent, errorCode };
          this.cdr.detectChanges();
        },
      });
  }

  firstPageLoad = false;

  /**
   * Método que se encarga de detecar el cambio del tag y realizar la redirección.
   * @param {Number} positionTagt
   * @memberof FilexSummaryBalancesComponent
   */
  async changeTab(positionTag: number) {
    if (positionTag === ZERO && this.firstPageLoad) {
      this.router.navigate(['/saldos-consolidados']);
      this.taggingButton(LOCATION.CONSOLIDATED_BALANCES);
    }
    this.firstPageLoad = true;
  }

  /**
   * Método que se encarga de generar el PDF.
   * @memberof FilexSummaryBalancesComponent
   * @returns {void}
   */
  generateSummaryFilexPDF() {
    this.taggingButton(ACTIONS.DOWNLOAD_BALANCES, LOCATION.CONSOLIDATED_BALANCES);
    this.mappedData && this._pdfBalancesUseCases.downloadBalancesFilexPDF(this.mappedData);
  }

  /**
   * Método que se encarga de gestionar el reintento de la carga de la información.
   * @param {IErrorRetry} retryEvent
   * @memberof FilexSummaryBalancesComponent
   */
  onRetry(retryEvent: IErrorRetry): void {
    if (retryEvent.actualRetry <= retryEvent.maximumRetriesRequest) {
      this.taggingButton(ACTIONS.TRY_AGAIN);
      this.getProducts(true);
    }
    if (retryEvent.actualRetry === THREE) {
      this.errorComponent = { ...MAXIMUM_RETRIES_ERROR_FILEX };
    }
  }

  /**
   * Método que dirige al Inicio de la SVN
   * @memberof FilexSummaryBalancesComponent
   * @returns {void}
   */
  goToHome(): void {
    this.taggingButton(ACTIONS.GO_TO_HOME);
    this.router.navigateByUrl(HOME_ROUTE);
  }
  /**
   * Método que seleciona el tab de internacionales.
   * @memberof FilexSummaryBalancesComponent
   * @returns {void}
   */
  selectInternacionalTab(): void {
    if (this.tabsGroup) {
      this.tabsGroup.selectIndex(ONE);
    }
  }

  onRetryComponent() {
    this.getProducts(true);
  }
}
