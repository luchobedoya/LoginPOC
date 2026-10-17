import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';

import { HabitGateway } from '../gateways/habit.gateway';
import { calculateDashboardStats } from '../services/dashboard-stats';
import { GetDashboardStatsUseCase } from './get-dashboard-stats.use-case';

describe('GetDashboardStatsUseCase', () => {
  let gateway: jasmine.SpyObj<HabitGateway>;
  let useCase: GetDashboardStatsUseCase;
  beforeEach(() => {
    gateway = jasmine.createSpyObj<HabitGateway>('HabitGateway', ['getDashboardStats']);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        GetDashboardStatsUseCase,
        { provide: HabitGateway, useValue: gateway },
      ],
    });
    useCase = TestBed.inject(GetDashboardStatsUseCase);
  });

  it('should delegate to the gateway and return its statistics', async () => {
    const stats = calculateDashboardStats({ asOf: '2026-10-17', habits: [], logs: [] });
    const response$ = of(stats);
    gateway.getDashboardStats.and.returnValue(response$);

    const result$ = useCase.execute();

    expect(gateway.getDashboardStats).toHaveBeenCalledTimes(1);
    expect(result$).toBe(response$);
    expect(await firstValueFrom(result$)).toBe(stats);
  });

  it('should propagate gateway errors', async () => {
    const error = new Error('Unavailable');
    gateway.getDashboardStats.and.returnValue(throwError(() => error));
    await expectAsync(firstValueFrom(useCase.execute())).toBeRejectedWith(error);
  });
});
