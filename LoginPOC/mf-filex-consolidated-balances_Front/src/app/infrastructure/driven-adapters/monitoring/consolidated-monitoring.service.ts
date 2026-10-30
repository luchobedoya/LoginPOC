import { inject, Injectable } from '@angular/core';
import { MonitoringService } from '@svn/shared-utils-web';
import { MonitoringGateway } from '../../../domain/monitoring/gateways/monitoring.gateway';
import { EnumMonitoring } from '../../../domain/monitoring/models/monitoring.enum';

@Injectable({
  providedIn: 'root',
})
export class ConsolidatedMonitoringService implements MonitoringGateway {
  private readonly _monitoringService = inject(MonitoringService);

  sendMonitoring(context: EnumMonitoring): void {
    this._monitoringService.changeContext(context);
  }
}
