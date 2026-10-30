import { TestBed } from '@angular/core/testing';
import { MonitoringGateway } from '../gateways/monitoring.gateway';
import { EnumMonitoring } from '../models/monitoring.enum';
import { MonitoringUseCaseService } from './monitoring.usecase.service';

describe('Service: InvoicesMonitoring', () => {
  let service: MonitoringUseCaseService;
  const MonitoringGatewayMock = {
    sendMonitoring: jest.fn(),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonitoringUseCaseService,
        {
          provide: MonitoringGateway,
          useValue: MonitoringGatewayMock,
        },
      ],
    });
    service = TestBed.inject(MonitoringUseCaseService);
  });

  test('should ...', () => {
    expect(service).toBeTruthy();
  });

  test('should called the method sendMonitoring del MonitoringGateway', () => {
    service.sendMonitoring(EnumMonitoring.REGISTRO_CONSULTA_CONSOLIDADO);
    expect(MonitoringGatewayMock.sendMonitoring).toHaveBeenCalledWith(EnumMonitoring.REGISTRO_CONSULTA_CONSOLIDADO);
  });
});
