import { environment } from '../../../../environments/environment';

export const DEFAULT_TIMEOUT_SERVICES = 15000;
export const TIMEOUT_SERVICES = Number.isInteger(environment.timeout)
  ? Number(environment.timeout)
  : DEFAULT_TIMEOUT_SERVICES;
export const DEFAULT_RENDER_STYLES = 1000;
export const DEFAULT_TIMEOUT_ALERTS = 10000;
