import { EnumMonitoring } from '../models/monitoring.enum';

export abstract class MonitoringGateway {
  abstract sendMonitoring(context: EnumMonitoring): void;
}
