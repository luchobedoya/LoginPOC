export enum EventsEnum {
  SEND_CARDS_SVN = 'SEND_CARDS_SVN',
  SEND_BUTTONS_SVN = 'SEND_BOTONES_SVN',
  SEND_PAGEVIEW_SVN = 'SEND_PAGEVIEW_SVN',
}

export const COMMON_FIELDS = {
  activo: 'svn',
  seccion: 'productos',
  modulo: 'filex',
  nombreFlujo: 'saldos consolidados',
};

export const COMMON_FIELDS_PAGEVIEW = {
  activo: 'svn',
  seccion: 'home',
  nombreFlujo: 'menu principal',
};

export enum TaggingElement {
  BUTTON = 'SEND_BUTTON',
  CARD = 'SEND_CARD',
  PAGEVIEW = 'PAGE_VIEW',
}

export const ACTIONS = {
  REFRESH: 'actualizar',
  DOWNLOAD_BALANCES: 'descargar consolidados',
  CHECK_PRODUCT: 'check product',
  NATIONAL: 'NATIONAL',
  INTERNATIONAL: 'INTERNATIONAL',
  TRY_AGAIN: 'intentar nuevamente ',
  GO_TO_HOME: 'ir a inicio',
  VIEW_DOLAR_DEPOSITS: 'cuentas en dolares',
  VIEW_EUROS_DEPOSITS: 'cuentas en euros',
  VIEW_DOLAR_LOANS: 'creditos en dolares',
  VIEW_EUROS_LOANS: 'creditos en euros',
  VIEW_DOLAR_INVESTMENTS: 'inversiones en dolares',
  VIEW_EUROS_INVESTMENTS: 'inversiones en euros',
};

export const ACTIONS_PATHS = {
  PATH_CONSOLIDATE_BALANCE: '/productos/saldos-consolidados/consolidados-por-productos',
};

export const ELEMENTS: Record<string, string> = {
  [ACTIONS.CHECK_PRODUCT]: 'consultar producto',
};

export const TAGGING_FIELDS = [
  { key: 'product', value: 'producto' },
  { key: 'destinationUrl', value: 'urlDestino' },
];

export const LOCATION = {
  CONSOLIDATED_BALANCES: 'consolidados por productos',
  BALANCES_BY_GROUPS: 'saldos por grupos',
};
