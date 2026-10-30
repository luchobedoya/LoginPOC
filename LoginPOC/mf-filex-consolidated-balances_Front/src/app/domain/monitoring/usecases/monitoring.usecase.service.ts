import { inject, Injectable } from '@angular/core';
import { MonitoringGateway } from '../gateways/monitoring.gateway';
import { EnumMonitoring } from '../models/monitoring.enum';

@Injectable({
  providedIn: 'root',
})
export class MonitoringUseCaseService {
  private readonly _monitoringGateway = inject(MonitoringGateway);

  sendMonitoring(context: EnumMonitoring): void {
    this._monitoringGateway.sendMonitoring(context);
  }
}
