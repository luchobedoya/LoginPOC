import {
  importProvidersFromConsolidatedBalancesWidget,
  ProductGateway,
} from '@bancolombia/consolidated-balances-widget-web';
import { FilexSummaryWidgetService } from '../../infrastructure/driven-adapters/filex-product/filex-summary-widget.service';

export const consolidatedBalancesWidgetConfig = importProvidersFromConsolidatedBalancesWidget({
  infrastructures: [
    {
      gateway: ProductGateway,
      implementation: FilexSummaryWidgetService,
    },
  ],
  labels: {
    MainConsolidatedComponent: {
      productName: '',
      messageAlertError: 'Inténtelo nuevamente. Algunos datos no se han podido cargar correctamente.',
      labelAllProducts: 'Ver todas las tarjetas',
      labelSeeMore: 'Ver más',
      labelSeeLess: 'Ver menos',
      labelLoadingText: 'Cargando...',
    },
    ErrorScreenComponent: {
      titleErrorMessage: 'Error desde el showcase new',
      descriptionError: 'Nuestro equipo esta trabajando para brindarle una pronta solución',
      titleErrorMessageSystem: 'Algo Salió mal',
      descriptionErrorSystem: 'No fue posible cargar la información.',
      defaultIcon: 'il-process-mistake',
    },
    DetailsConsolidatedComponent: {
      titleTable: '',
      titleSearch: '',
      titleDetail: '',
      seeDetail: 'Puedes seleccionar hasta 10 facturas para pagar o eliminar.',
      block: 'Bloquear',
      seeStatements: 'Ver extractos',
      unlock: 'Desbloquear',
    },
    TableNotFoundComponent: {
      notFoundText: 'Tu búsqueda no obtuvo resultados. Rectifica la información e intenta nuevamente',
    },
  },
});
