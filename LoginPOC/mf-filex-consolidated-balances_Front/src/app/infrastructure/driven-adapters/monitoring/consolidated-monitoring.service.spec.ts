import { TestBed } from '@angular/core/testing';
import { MonitoringService } from '@svn/shared-utils-web';
import { EnumMonitoring } from '../../../domain/monitoring/models/monitoring.enum';
import { ConsolidatedMonitoringService } from './consolidated-monitoring.service';

describe('Service: ConsolidatedMonitoringService', () => {
  let service: ConsolidatedMonitoringService;
  const MonitoringServiceMock = {
    changeContext: jest.fn(),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConsolidatedMonitoringService,
        {
          provide: MonitoringService,
          useValue: MonitoringServiceMock,
        },
      ],
    });
    service = TestBed.inject(ConsolidatedMonitoringService);
  });

  test('should', () => {
    expect(service).toBeTruthy();
  });

  test('should called the method changeContext del MonitoringService', () => {
    service.sendMonitoring(EnumMonitoring.REGISTRO_CONSULTA_CONSOLIDADO);
    expect(MonitoringServiceMock.changeContext).toHaveBeenCalledWith(EnumMonitoring.REGISTRO_CONSULTA_CONSOLIDADO);
  });
});
