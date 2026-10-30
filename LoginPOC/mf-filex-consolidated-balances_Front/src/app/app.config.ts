import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BcConfigIconModule } from '@bancolombia/design-system-web/bc-icon';
import { BcConfigIllustrationModule } from '@bancolombia/design-system-web/bc-illustration';
import { BcDialogService } from '@bancolombia/design-system-web/bc-services';
import { provideMicroFront } from '@bancolombia/ngx-microfront-toolkit';
import { provideAuthLib } from '@svn/auth-lib';
import { CommonStateService } from '@svn/common-state';
import {
  AccessValidateGateway,
  AccessValidateService,
  activeSessionInterceptor,
  checkWafErrorInterceptor,
  commonSFHeadersInterceptor,
  DateValuePipe,
  hostCredentialsInterceptor,
  PricingService,
  provideMonitoringServicesConfig,
  providePdfServicesConfig,
  provideSVNServiceRequest,
} from '@svn/shared-utils-web';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { consolidatedBalancesWidgetConfig } from './core/config/consolidated-balances-widget.configuration';
import { MonitoringGateway } from './domain/monitoring/gateways/monitoring.gateway';
import { MonitoringUseCaseService } from './domain/monitoring/usecases/monitoring.usecase.service';
import { PdfBalancesGateway } from './domain/pdf-balances/models/pdf-balances-gateway';
import { PdfBalancesUsecasesService } from './domain/pdf-balances/usecases/pdf-balances-usecases.service';
import { ProductsSummyFilexGateway } from './domain/products-summy-filex/models/gateways/products-summy-filex-gateway';
import { ProductsSummyFilexUsecasesService } from './domain/products-summy-filex/usecases/products-summy-filex-usecases.service';
import { TaggingGateway } from './domain/tagging/gateways/tagging.gateway';
import { SetTaggingUseCase } from './domain/tagging/usecases/set-tagging.usecase';
import { FilexProductsService } from './infrastructure/driven-adapters/filex-product/filex-products.service';
import { FilexProductsMapperService } from './infrastructure/driven-adapters/filex-product/mapper/filex-products-mapper.service';
import { ConsolidatedMonitoringService } from './infrastructure/driven-adapters/monitoring/consolidated-monitoring.service';
import { PdfService } from './infrastructure/driven-adapters/pdf/pdf.service';
import { TaggingService } from './infrastructure/driven-adapters/tagging/tagging.service';
import { AlertService } from './infrastructure/utils/services/alert.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideMicroFront(),

    // Shared Host dependencies
    (window as any).commonState ? { provide: CommonStateService, useValue: (window as any).commonState } : [],

    // SVN Core providers
    provideAuthLib(),
    provideHttpClient(
      withInterceptors([
        commonSFHeadersInterceptor,
        ...(!isDevMode() ? [hostCredentialsInterceptor] : []),
        activeSessionInterceptor,
        checkWafErrorInterceptor,
      ])
    ),
    provideSVNServiceRequest(),

    consolidatedBalancesWidgetConfig,

    // General UI providers
    DateValuePipe,
    DatePipe,
    BcDialogService,
    AlertService,
    { provide: BcConfigIconModule, useValue: { path: environment.BDS_ICONS_URL } },
    { provide: BcConfigIllustrationModule, useValue: { path: environment.BDS_ICONS_URL } },

    // PDF
    providePdfServicesConfig(),
    PdfBalancesUsecasesService,
    { provide: PdfBalancesGateway, useClass: PdfService },

    // Filex Consolidated Balances
    FilexProductsService,
    FilexProductsMapperService,
    ProductsSummyFilexUsecasesService,
    { provide: ProductsSummyFilexGateway, useExisting: FilexProductsService },

    // Monitoring
    provideMonitoringServicesConfig(),
    MonitoringUseCaseService,
    {
      provide: MonitoringGateway,
      useClass: ConsolidatedMonitoringService,
    },

    // Tagging
    SetTaggingUseCase,
    { provide: TaggingGateway, useClass: TaggingService },

    // Pricing Guard
    AccessValidateService,
    { provide: AccessValidateGateway, useClass: PricingService },
  ],
};
